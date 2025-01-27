import { convertToMinutes, getNearestStopPoints, parseAndReturnArrivalData, parseAndReturnDirectionData, validatePostCode} from './utils.js';
import { fetchPostCodeInfo, fetchTflStopPoints, fetchTflArrivals, validatePostCodeThroughAPI,  fetchDirectionToStopPoint} from './fetch.js';
import readlineSync from 'readline-sync';

export const getPostCode = () => {
    console.log("Please enter the post code :");
    return readlineSync.prompt();
}

export const getDirectionChoice = () => {
    console.log("Do you want to see the direction to the bus stops (Y/N)?");
    return readlineSync.prompt();
}

const printHeading = () => {
    console.log("===========================================================================");
    console.log('\x1b[32m%s\x1b[0m','Stop Id' + '\t\t'+ 'Bus' + "\t" + 'Time' + "\t" + 'Destination'); 
    console.log("===========================================================================");
}

const printBusInformation = (data) => {
    printHeading();
    data.forEach(element => {
        console.log(element.naptanId + '\t' + element.lineId + "\t" + element.timeToStation + "\t" + element.destinationName)  
    })
}

const printDirectionInformation = (naptanId,directionInformation) => {
    console.log ('\x1b[32m%s\x1b[0m',"Direction to the stop point : " + naptanId);
    console.log("==============================================")
    console.log(parseAndReturnDirectionData(directionInformation));
    console.log("==============================================")
}


const getPostCodeInformation = async(postCode) => {      
    const postCodeResponse = await fetchPostCodeInfo(postCode);
    if (!validatePostCodeThroughAPI(postCodeResponse)) {
        console.log('You entered wrong postcode. Please try again')
        return null;
    }
    const postCodeData = await postCodeResponse.json();
    return postCodeData;
 
}

const getBusStopPointsFromPostCode = async(postCodeData) => {
    const tflStopPointsResponse = await fetchTflStopPoints(postCodeData.result.latitude, postCodeData.result.longitude);
    const stopPointsData = await tflStopPointsResponse.json();
    const stopPoints = getNearestStopPoints(stopPointsData,2);
    return stopPoints;
}

const getDirectionInformationForAStopPoint = async(postCode, naptanId) => {
    const tflDirectionResponse = await fetchDirectionToStopPoint(postCode, naptanId);
    const tflDirectionData = await tflDirectionResponse.json();
    return tflDirectionData;
}

const getArrivalInformationForAStopPoint = async(naptanId) => {
    const tflStopResponse = await fetchTflArrivals(naptanId);
    const stopPointsData  = await tflStopResponse.json();
    return stopPointsData;
}

let postCode;
let postCodeInformation;
while (postCodeInformation == null) {
    postCode = getPostCode();
    if (validatePostCode(postCode)) 
        postCodeInformation = await getPostCodeInformation(postCode);
    else {
        console.log('You entered wrong postcode. Please try again');
    }
}   

//logger.log('info', 'Entered PostCode : ' + postCode);
const plannerChoice = getDirectionChoice();
//logger.log('info', 'Entered Direction Choice  : ' + plannerChoice);
const stopPoints = await getBusStopPointsFromPostCode(postCodeInformation);

if (stopPoints !== null) {
    for (let stopPoint of stopPoints) {
        const { naptanId } = stopPoint;
        const arrivalInformation = await getArrivalInformationForAStopPoint(naptanId);  

        if (plannerChoice.toUpperCase() === 'Y') {
            const directionInformation = await getDirectionInformationForAStopPoint(postCode, naptanId);  
            printDirectionInformation(naptanId,directionInformation)   ;
            console.log("\n");
        }

        if (arrivalInformation.length !== 0) {
            printBusInformation(parseAndReturnArrivalData(arrivalInformation));
            console.log("\n");
        } else {
            console.log(`There are currently no busses at this stop(${naptanId})`);
            console.log("=============================================================")
            console.log("\n");
        }
    }
} else {
    console.log("Found no stop points for the given post code");
}
 


