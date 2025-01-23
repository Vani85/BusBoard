


export const convertToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    return minutes;
};

export const getNearestStopPoints = (stopPoints) => {
    const arrStopPoints = [];
    stopPoints.stopPoints.forEach(({naptanId, distance}) => {
        const stopPoint = {
            naptanId,
            distance
        };
        arrStopPoints.push(stopPoint);

    });

    arrStopPoints.sort((a,b) => a.distance - b.distance);

    return arrStopPoints;
}

export const getNextArrivals = (data, maxArrivals = 5) => {
    const arrivals = [];

    data.forEach(({lineId, timeToStation, destinationName, towards}) => {
        const arrival = {
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