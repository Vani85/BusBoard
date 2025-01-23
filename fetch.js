import fetch from 'node-fetch';
const api_key = process.env.API_KEY

export const fetchPostCodeInfo = async (postCode) => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postCode}`);  
    return response;
}

export const fetchTflStopPoints = async (postCodeResponse) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${postCodeResponse.result.latitude}&lon=${postCodeResponse.result.longitude}&stopTypes=NaptanPublicBusCoachTram&modes=bus`);
    return response;
}

export const fetchTflArrivals = async (stopCode) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?api_key=${api_key}`);
    return response;
}

export const validateResponse = (response) => {
    if (response.status !== 200) {
        return false;
    } 

    return true;
} 

export const validatePostCode = (response) => {   
    if (response.status !== 200 && response.statusText == 'Not Found') {
        return false;
    } 

    return true;
}

