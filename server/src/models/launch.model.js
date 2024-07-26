const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_LAUNCH_NUMBER = 100;


const launch = {
    flightNumber:99,
    mission : 'Kepler Exploration X',
    rocket : 'Explorer IS1',
    launchDate : new Date('December 28, 2030'),
    target : 'Kepler-442 b',
    customer : [
        'ZTM','NASA'
    ],
    upcoming:true,
    success:true
}

saveLaunchData(launch);

async function saveLaunchData(launch){
    try{
        //referential integrity by the validating the target's planet 
        const planet = await planets.findOne({
            keplerName:launch.target
        });

        if(!planet){
            throw new Error('there is no matching planet');
        }

        //end here
        await launchesDB.updateOne(
           { flightNumber: launch.flightNumber,
           },launch,{
            upsert:true
           }
        );
    }catch (err){
        console.error(err);
    }
}

async function getAllLaunches (){
    return await launchesDB.find({},{
        __v:0,_id:0
    })
}

async function getLatestFlightNumber()
{
    try{
        const latestLaunch = await launchesDB.findOne({

        }
        ).sort('-flightNumber');
        if(!latestLaunch){
            return DEFAULT_LAUNCH_NUMBER;
        }
        return latestLaunch.flightNumber;
    }catch(err){
        console.log('error  '+ err);
    }
}


async function scheduleNewLaunch(launch){
    try{
    const newFlightNumber = await getLatestFlightNumber()+1;
    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming:true,
        customer:['NASA','ALSA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunchData(newLaunch)
} catch(err){
    console.error('error  ' + err);
}
}

function existLaunchById(id){
    return launches.has(id);
}

function abortLaunchById(id){
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {

    getAllLaunches,
    scheduleNewLaunch,
    existLaunchById,
    abortLaunchById
};