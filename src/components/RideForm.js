import React, { useState } from 'react';

const RIDE_DURATION = 15;
const DRIVER_REST = 5;

const RideForm = () => {
    const [rideTimes, setRideTimes] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [rideDuration, setRideDuration] = useState(RIDE_DURATION);
    const [restTime, setRestTime] = useState(DRIVER_REST);

    const calculateDrivers = (e) => {
        // Don't refresh page on submit
        e.preventDefault();
        // split ride times on commas or spaces and convert to integers
        const times = rideTimes.split(/[ ,]+/).map((t) => parseInt(t, 10));
        const nextDrivers = assignDrivers(times, []);
        setDrivers([...nextDrivers]);
    }

    // recursively assign drivers
    const assignDrivers = (times, d) => {
        const rideTime = rideDuration + restTime;
        // base case; recursion complete
        if (times.length === 0) {
            console.log(d);
            return d;
        }

        // setup variables for ride assignments
        let firstRide = times.shift();
        let driver = {id: d.length + 1, rides: [firstRide]};
        let nextRide = firstRide;
        let rideIndexes = [];

        // loop over all remaining ride times and assign valid rides to driver
        // when a ride has been 'claimed' by a driver, add its index to rideIndexes for later removal
        times.forEach((time, index) => {
            if (time >= nextRide + rideTime) {
                nextRide = time;
                driver.rides.push(time);
                rideIndexes.push(index);
            }
        })
        // add driver to array of drivers
        d.push(driver);

        // remove claimed rides from list of ride times
        while(rideIndexes.length > 0) {
            times.splice(rideIndexes.pop(), 1);
        }

        // invoke function again with remaining ride times
        return assignDrivers(times, d);
    }

    return (
        <div>
            <form>
                <label>
                    Ride Times (in minutes): 
                    <input type="text" name="rideTimes" onChange={(e) => setRideTimes(e.target.value)} />
                </label>
                <input type="submit" value="Assign Drivers" onClick={(e) => calculateDrivers(e)} />
            </form>
            <br></br>
            {
                drivers.length > 0 &&
                <div>
                    DRIVERS REQUIRED: {drivers.length}
                    <ul>
                        {drivers.map((d) => {return(<li key={d.id} style={{textAlign: 'left'}}>{d.id} : {d.rides.join(', ')} </li>)})} 
                    </ul>
                </div>
            }
            Optional Parameters:
            <form>
                <div>
                    <label>
                        Change Ride Duration: 
                        <input type="text" name="rideDuration" value={rideDuration} onChange={(e) => setRideDuration(parseInt(e.target.value, 10))} />
                    </label>
                </div>
                <div>
                    <label>
                        Change Driver Rest Time: 
                        <input type="text" name="restTime" value={restTime} onChange={(e) => setRestTime(parseInt(e.target.value,10))} />
                    </label>
                </div>
            </form>
        </div>
    );
}

export default RideForm;