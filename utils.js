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

export const getNearestStopPoints = (stopPoints,numberOfStopPoints) => {
    logger.log('info', stopPoints);

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