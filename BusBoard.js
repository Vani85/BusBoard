import { convertToMinutes, getNearestStopPoints, getNextArrivals } from './utils.js';
import { fetchPostCodeInfo, fetchTflStopPoints, fetchTflArrivals, validateResponse, validatePostCode} from './fetch.js';
import readlineSync from 'readline-sync';

const api_key = process.env.API_KEY


export const getPostCode = () => {
    console.log("Please enter the post code :");

    return readlineSync.prompt();
}

const printHeading = () => {
    console.log("============================================================");
    console.log('Bus' + "\t" + 'Time' + "\t" + 'Destination' + "\t" + 'Route'); 
    console.log("============================================================");
}

const printBusInformation = (data) => {
    printHeading();
    data.forEach(element => {
        console.log(element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName + "\t" + element.towards)  
    })
}


const getPostCodeInformation = async() => {
    try {
        const postCode = getPostCode();
        const postCodeResponse = await fetchPostCodeInfo(postCode);
        if (!validatePostCode(postCodeResponse)) {
            console.log('You entered wrong postcode')
            return false;
        }

        const postCodeData = await postCodeResponse.json();
        return postCodeData;
    } catch(error) {
        throw error;
    }
}

const getBusStopPointsFromPostCode = async(postCodeData) => {
    const tflStopPointsResponse = await fetchTflStopPoints(postCodeData,api_key);
    const stopPointsData = await tflStopPointsResponse.json();
    const stopPoints = getNearestStopPoints(stopPointsData,2);
    return stopPoints;
}


const getArrivalInformationForAStopPoint = async(point) => {
    const tflStopResponse = await fetchTflArrivals(point.naptanId,api_key);
    const stopPointsData = await tflStopResponse.json();
    return stopPointsData;
}

const getArrivalInformationForAllStopPoints = async(stopPoints) => {
    const arrivalInformation = [];
    stopPoints.forEach((point) => {
        arrivalInformation.push(getArrivalInformationForAStopPoint(point));
    })   

    if (!arrivalInformation.length) {
        return null;
    }

    return Promise.all(arrivalInformation);
}

try {
    let postCode = await getPostCodeInformation();

    while (!postCode) {
        postCode = await getPostCodeInformation();
    }

    const stopPoints = await getBusStopPointsFromPostCode(postCode);
    if(stopPoints!==null) {
        const arrivalInformation = await getArrivalInformationForAllStopPoints(stopPoints);

        if (arrivalInformation !== null) {
            arrivalInformation.forEach((arrivals) => {
                printBusInformation(getNextArrivals(arrivals));
            })
        } else {
            console.log('Found no buses coming')
        }

    } else {
        console.log("Found no stop points for the given post code");
    }
} catch(error) {
    console.log(error);
}

 


