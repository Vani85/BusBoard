import fetch from 'node-fetch';
import { logger } from './utils.js';
const api_key = process.env.API_KEY

export const fetchPostCodeInfo = async (postCode) => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postCode}`);  
    return response;
}

const URL = 'https://api.tfl.gov.uk/StopPoint/'

export const fetchTflStopPoints = async (latitude, longitude) => {
    const response = await fetch(`${URL}?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`);
    return response;
}

export const fetchTflArrivals = async (stopCode) => {
    const response = await fetch(`${URL}${stopCode}/Arrivals?api_key=${api_key}`);
    return response;
}

export const validatePostCode = (response) => {   
    if (response.status !== 200 || response.statusText == 'Not Found' ) {
        logger.log('error',response);

        return false;
    } 

    return true;
}

