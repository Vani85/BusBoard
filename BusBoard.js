import { getPostCode, convertToMinutes, getNearestStopPoints, getNextArrivals } from './utils.js';
import { fetchPostCodeInfo, fetchTflStopPoints, fetchTflArrivals } from './fetch.js';

const api_key = process.env.API_KEY

const printHeading = () => {
    console.log("============================================================");
    console.log('Bus' + "\t" + 'Time' + "\t" + 'Destination' + "\t" + 'Route'); 
    console.log("============================================================");
}

const printData = (data) => {
    printHeading();
    data.forEach(element => {
        console.log(element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName + "\t" + element.towards)  
    })
}

// Asking the user to enter a postcode
const postCode = getPostCode();

// Getting information about the entered postcode
const postCodeResponse = await fetchPostCodeInfo(postCode);
const postCodeData = await postCodeResponse.json();

// Getting a list of nearest stop points
const tflStopPointsResponse = await fetchTflStopPoints(postCodeData,api_key);
const stopPointsData = await tflStopPointsResponse.json();
const stopPoints = getNearestStopPoints(stopPointsData);

// Getting a list of arriving buses for the first stop point
const tflFirstStopResponse = await fetchTflArrivals(stopPoints[0].naptanId,api_key);
const firstStopData = await tflFirstStopResponse.json();

// Getting a list of arriving buses for the second stop point
let tflSecondStopResponse = await fetchTflArrivals(stopPoints[1].naptanId,api_key);
const secondStopData = await tflSecondStopResponse.json();

printData(getNextArrivals(firstStopData));
printData(getNextArrivals(secondStopData));



