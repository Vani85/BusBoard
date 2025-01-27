import fetch from 'node-fetch';
import { logger } from './utils.js';
const api_key = process.env.API_KEY

const URL = 'https://api.tfl.gov.uk/'

export const fetchAPI = async(URL) => {
    try {
        const response = await fetch(URL);
        if(response.status === 404) {
            throw new Error("Resource not found");
        } else if(response.status === 500) {
            throw new Error("Internal Server Error");
        } else if(response.status !==200) {
            throw new Error("Error while fetching API response.");
        }
        return response;
    } catch(e) {
        logger.log('error', e.message);        
        throw e;
    }    
}

export const fetchPostCodeInfo = async (postCode) => (
    fetchAPI(`https://api.postcodes.io/postcodes/${postCode}`)
)

export const fetchTflStopPoints = async (latitude, longitude) => (
    fetchAPI(`${URL}StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`)
) 

export const fetchTflArrivals = async (stopCode) => (
    fetchAPI(`${URL}StopPoint/${stopCode}/Arrivals?api_key=${api_key}`)
)

export const fetchDirectionToStopPoint = async(postCode, stopPoint) => (
    fetchAPI(`${URL}Journey/JourneyResults/${postCode}/to/${stopPoint}`) 
)

export const validatePostCodeThroughAPI = (response) => {   
    if (response.status !== 200 || response.statusText == 'Not Found' ) {
        logger.log('error',response);

        return false;
    } 

    return true;
}
