import { convertToMinutes, getNearestStopPoints, parseAndReturnArrivalData } from './utils.js';
import { fetchPostCodeInfo, fetchTflStopPoints, fetchTflArrivals, validateResponse, validatePostCode} from './fetch.js';
import readlineSync from 'readline-sync';

export const getPostCode = () => {
    console.log("Please enter the post code :");
    return readlineSync.prompt();
}

const printHeading = () => {
    console.log("===========================================================================");
    console.log('Stop Id' + '\t\t'+ 'Bus' + "\t" + 'Time' + "\t" + 'Destination' + "\t\t\t" + 'Route'); 
    console.log("===========================================================================");
}

const printBusInformation = (data) => {
    printHeading();
    data.forEach(element => {
        console.log(element.naptanId + '\t' + element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName + "\t\t" + element.towards)  
    })
}


const getPostCodeInformation = async(postCode) => {
    try {       
        const postCodeResponse = await fetchPostCodeInfo(postCode);
        if (!validatePostCode(postCodeResponse)) {
            console.log('You entered wrong postcode')
            return null;
        }

        const postCodeData = await postCodeResponse.json();
        return postCodeData;
    } catch(error) {
        throw error;
    }
}

const getBusStopPointsFromPostCode = async(postCodeData) => {
    const tflStopPointsResponse = await fetchTflStopPoints(postCodeData);
    const stopPointsData = await tflStopPointsResponse.json();
    const stopPoints = getNearestStopPoints(stopPointsData,2);
    return stopPoints;
}

const getArrivalInformationForAStopPoint = async(point) => {
    const tflStopResponse = await fetchTflArrivals(point.naptanId);
    const stopPointsData  = await tflStopResponse.json();
    return stopPointsData;
}

const getArrivalInformationForAllStopPoints = async(stopPoints) => {
    const arrivalInformation = [];    
    stopPoints.forEach((point) => {
        arrivalInformation.push(getArrivalInformationForAStopPoint(point));
    })   

    return Promise.all(arrivalInformation);
}

try {
    let postCode;// = await getPostCodeInformation();
    let postCodeInformation;
    while (postCodeInformation == null) {
        postCode = getPostCode();
        postCodeInformation = await getPostCodeInformation(postCode);
    }

    const stopPoints = await getBusStopPointsFromPostCode(postCodeInformation);
    if(stopPoints!==null) {
        const arrivalInformation = await getArrivalInformationForAllStopPoints(stopPoints);
        if (arrivalInformation !== null) {
            arrivalInformation.forEach((arrivals) => {
                printBusInformation(parseAndReturnArrivalData(arrivals));
            })
        } else {
            console.log('There are currently no busses at stops near this post code ');
        }

    } else {
        console.log("Found no stop points for the given post code");
    }
} catch(error) {
    console.log(error);
}

 


