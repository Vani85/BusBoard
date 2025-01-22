import fetch from 'node-fetch';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const readline = require('readline-sync');

const getStopCode = () => {
    console.log('Please enter stop code');
    let stopCode = readline.prompt();

    return stopCode;
};

// (The stop code is 490008660N).

const api_key = process.env.API_KEY

const fetchTfl = async (api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${getStopCode()}/Arrivals?api=${api_key}`);
    
    return response;
}

const printHeading = () => {
    console.log('Bus' + "\t" + 'Time' + "\t" + 'Destination' + "\t" + 'Route'); 
}

let response = await fetchTfl(api_key);
const data = await response.json();

const convertToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    return minutes;
};


const getDataFromResponse = () => {
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



const printData = () => {
    const data = getDataFromResponse();

    printHeading();
    data.forEach(element => {
        console.log(element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName + "\t" + element.towards)  
    })
}

printData()

// console.log(getDataFromResponse())



