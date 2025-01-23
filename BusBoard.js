import { convertToMinutes, getNearestStopPoints, getNextArrivals } from './utils.js';
import { fetchPostCodeInfo, fetchTflStopPoints, fetchTflArrivals, validateResponse } from './fetch.js';
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
    const postCode = getPostCode();
    const postCodeResponse = await fetchPostCodeInfo(postCode);
    if (!validateResponse(postCodeResponse)) {
        console.log('You entered wrong postcode')
        return false;
    }

    const postCodeData = await postCodeResponse.json();
    return postCodeData;
}

const getBusStopPointsFromPostCode = async(postCodeData) => {
    const tflStopPointsResponse = await fetchTflStopPoints(postCodeData,api_key);
    const stopPointsData = await tflStopPointsResponse.json();
    const stopPoints = getNearestStopPoints(stopPointsData).slice(0,2);
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

    return Promise.all(arrivalInformation);
}


let postCode = await getPostCodeInformation();

while (!postCode) {
    postCode = await getPostCodeInformation();
}

const stopPoints = await getBusStopPointsFromPostCode(postCode);
const arrivalInformation = await getArrivalInformationForAllStopPoints(stopPoints);

arrivalInformation.forEach((arrivals) => {
    printBusInformation(getNextArrivals(arrivals));
})

 


