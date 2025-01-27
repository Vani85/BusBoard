import { convertToMinutes, getNearestStopPoints, parseAndReturnArrivalData } from './utils.js';
import { fetchPostCodeInfo, fetchTflStopPoints, fetchTflArrivals, validatePostCode, fetchDirectionToStopPoint} from './fetch.js';
import readlineSync from 'readline-sync';

export const getPostCode = () => {
    console.log("Please enter the post code :");
    return readlineSync.prompt();
}

const printHeading = () => {
    console.log("===========================================================================");
    console.log('Stop Id' + '\t\t'+ 'Bus' + "\t" + 'Time' + "\t" + 'Destination'); 
    console.log("===========================================================================");
}

const printBusInformation = (data) => {
    printHeading();
    data.forEach(element => {
        console.log(element.naptanId + '\t' + element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName)  
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
    const tflStopPointsResponse = await fetchTflStopPoints(postCodeData.result.latitude, postCodeData.result.longitude);
    const stopPointsData = await tflStopPointsResponse.json();
    const stopPoints = getNearestStopPoints(stopPointsData,2);
    return stopPoints;
}

const getDirectionInformationForAStopPoint = async(postCode, naptanId) => {
    const tflDirectionResponse = fetchDirectionToStopPoint(postCode, naptanId);
    const tflDirectionData = (await tflDirectionResponse).json();

    return tflDirectionData;
}

const getDirectionInformation = async(postCode, stopPoints) => {
    const directionInformation = [];    
    stopPoints.forEach((point) => {
        directionInformation.push(getDirectionInformationForAStopPoint(postCode, point.naptanId));
    })
    return Promise.all(directionInformation);
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

//NW5 1TL -- Softwire Bus Stop
//B34 6AL -- no stop points
//?>(234234 -- TypeError: Cannot read properties of undefined (reading 'latitude')
// !need to check the case with no arriving buses

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
        const directionInformation = await getDirectionInformation(postCode, stopPoints);      

        if (arrivalInformation !== null) {
            arrivalInformation.forEach((arrivals) => {
                printBusInformation(parseAndReturnArrivalData(arrivals));
            })
            
            for (let directionInfo of directionInformation) {
                console.log(directionInfo);
            }
        } else {
            console.log('There are currently no busses at stops near this post code ');
        }

    } else {
        console.log("Found no stop points for the given post code");
    }
} catch(error) {
    console.log(error);
}

 


