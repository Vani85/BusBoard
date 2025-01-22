import fetch from 'node-fetch';

const api_key = process.env.API_KEY

const fetchTfl = async (api_key) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals`);
    return response;
}

let response = await fetchTfl(api_key);


const data = await response.json();

data.forEach(element => {
    console.log(element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName + "\t" + element.towards);    
});