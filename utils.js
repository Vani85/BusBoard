


export const convertToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    return minutes;
};

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

    data.forEach(({naptanId,lineId, timeToStation, destinationName, towards}) => {
        const arrival = {
            naptanId,
            lineId,
            timeToStation: convertToMinutes(timeToStation),
            destinationName,
            towards
        };
        arrivals.push(arrival);
        
    });
    
    arrivals.sort((a,b) => a.timeToStation - b.timeToStation);
    return arrivals.slice(0, maxArrivals);
}