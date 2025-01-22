import fetch from 'node-fetch';

export const fetchPostCodeInfo = async (postCode) => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postCode}`);    
    
    return response;
}

export const fetchTflStopPoints = async (postCodeResponse,api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${postCodeResponse.result.latitude}&lon=${postCodeResponse.result.longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`);
    
    return response;
}

export const fetchTflArrivals = async (stopCode, api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?api=${api_key}`);
    
    return response;
}