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
    //console.log(element.timeToStation);
    //console.log(element.destinationName);
    //console.log(element.towards);
});


//console.log(data);


//var jsonResponse = JSON.parse(response);

//console.log(jsonResponse);

//The stop code is 490008660N
//?api_key=b9e92cca5bc742e19a50fac508f0805c
//https://api.tfl.gov.uk/StopPoint/490008660N[?includeCrowdingData]
//https://api.tfl.gov.uk/StopPoint/b9e92cca5bc742e19a50fac508f0805c


//https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption?api_key=b9e92cca5bc742e19a50fac508f0805c

