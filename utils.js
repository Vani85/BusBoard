import winston from 'winston';

export const logger = winston.createLogger({
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export const convertToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    return minutes;
};


export const validatePostCode = (postcode) => {
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

    return postcodeRegex.test(postcode);
}
  

export const getNearestStopPoints = (stopPoints,numberOfStopPoints) => {
    const arrStopPoints = [];
    stopPoints.stopPoints.forEach(({naptanId, distance}) => {
        const stopPoint = {
            naptanId,
            distance
        };
        arrStopPoints.push(stopPoint);

    });
    
    if (!arrStopPoints.length) {
        return null;
    }
        
    return arrStopPoints.sort((a,b) => a.distance - b.distance).slice(0,numberOfStopPoints);
}

export const parseAndReturnArrivalData = (data, maxArrivals = 5) => {
    const arrivals = [];

    data.forEach(({naptanId,lineId, timeToStation, destinationName}) => {
        const arrival = {
            naptanId,
            lineId,
            timeToStation: convertToMinutes(timeToStation),
            destinationName,
        };
        arrivals.push(arrival);
        
    });
    
    arrivals.sort((a,b) => a.timeToStation - b.timeToStation);

    return arrivals.slice(0, maxArrivals);
}

export const parseAndReturnDirectionData = (data) => {
    let directionMessage = "";
    const messageArr = [];
    
    const jounerys = data.journeys;
    for(let journey of jounerys) {
        const legs = journey.legs;
        for (let leg of legs) {
            const steps = leg.instruction.steps;
            for(let step of steps) {
                directionMessage += step.descriptionHeading + " ";
                directionMessage += step.description;                
                messageArr.push(directionMessage.trim());
                directionMessage = '';
                
            }
        }

    }
    
    return messageArr.join('\n');
}