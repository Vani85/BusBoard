import fetch from 'node-fetch';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const readline = require('readline-sync');

// (The stop code is 490008660N).

const api_key = process.env.API_KEY

const fetchTfl = async (stopCode,api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?api=${api_key}`);
    return response;
}

const fetchTflStopPoints = async (postCodeResponse,api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${postCodeResponse.result.latitude}&lon=${postCodeResponse.result.longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`);
    return response;
}

const fetchPostCode = async (postCode) => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postCode}`);    
    return response;
}

const printHeading = () => {
    console.log("============================================================");
    console.log('Bus' + "\t" + 'Time' + "\t" + 'Destination' + "\t" + 'Route'); 
    console.log("============================================================");
}

const getPostCode=() => {
    console.log("Please enter the post code :");
    return readline.prompt();
}

const convertToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    return minutes;
};


const getDataFromResponse = (data) => {
    const arr = [];

    data.forEach(element => {
        const obj = {
            lineId: element.lineId,
            timeToStation: convertToMinutes(element.timeToStation),
            destinationName: element.destinationName,
            towards: element.towards
        };
    
        arr.push(obj);
        
    });
    
    arr.sort((a,b) => a.timeToStation - b.timeToStation);

    return arr.slice(0, 5);
}



const printData = (data) => {
    const output = getDataFromResponse(data);

    printHeading();
    output.forEach(element => {
        console.log(element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName + "\t" + element.towards)  
    })
}

const getStopPoints = (stopPoints) => {
    const arrStopPoints = [];
    stopPoints.stopPoints.forEach(element => {
        const obj = {
            naptanId: element.naptanId,
            distance: element.distance
        };
        arrStopPoints.push(obj);

    });

    arrStopPoints.sort((a,b) => a.distance - b.distance);
    return arrStopPoints;
}


// Starting point
const postCode = getPostCode();
const postCodeResponse = await fetchPostCode(postCode);
const postCodeData = await postCodeResponse.json();

// GEt stop points from TFL
const tflStopPointsResponse = await fetchTflStopPoints(postCodeData,api_key);
const stopPoints = await tflStopPointsResponse.json();

const arrStopPoints = getStopPoints(stopPoints);

const tflResponse = await fetchTfl(arrStopPoints[0].naptanId,api_key);
const data1 = await tflResponse.json();
printData(data1);

let response = await fetchTfl(arrStopPoints[1].naptanId,api_key);
const data2 = await response.json();
printData(data2);



