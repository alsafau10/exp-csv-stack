const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');
require('dotenv/config');

const DEFAULT_LAUNCH_NUMBER = 100;


const launch = {
    flightNumber:99, // flight_launch
    mission : 'Kepler Exploration X', //name
    rocket : 'Explorer IS1',//rocket.name
    launchDate : new Date('December 28, 2030'), //date_local
    target : 'Kepler-442 b',
    customer : [
        'ZTM','NASA' //payload.customers for each data
    ],
    upcoming:true,//upcoming
    success:true//success
}

saveLaunchData(launch);

async function fetchLaunchesData(API){
    const data = {
        query:{},
        options:{
            pagination:false,
            populate: [{
                path:'rocket',
                select:{
                    name:1
                }
            },{
                path:'payloads',
                select: {
                    customers:1
                }
            }
        ]
        }
    };

    try {
        const response = await fetch(API, {
            method : 'POST',
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            throw new Error('response status: ' + response.status);
        }
        return await response.json();
    }catch(err){
        console.error(`new error has occured ${err.message}`);
    }

}

async function convertLaunchesData(){
    const docs = await fetchLaunchesData(process.env.SPACE_API);
    const lauchesDocs = docs.docs;

    for(let launchDoc of lauchesDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap(payload=>payload['customers']);

        const launchSpace = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }

        console.info(`${launchSpace.flightNumber} ${launchSpace.mission}`);
    }
}

async function loadLaunchesData(){
    const firstLaunch =await filterLaunch({
        flightNumber: 1,
        rocket: 'falcon',
        mission: 'falconSat',
    });

    if(!firstLaunch){
        console.info('object already loaded');
    }
    else{
        const response = await convertLaunchesData();    
        await saveLaunch(response);
    }

        
}

async function filterLaunch(filter){
    return await launchesDB.findOne(filter);
}

async function saveLaunchData(launch){
        //referential integrity by the validating the target's planet 
        const planet = await planets.findOneAndUpdate({
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

async function existLaunchById(id){
    return await filterLaunch({
        flightNumber: id,
    })
}

async function abortLaunchById(id){
    const aborted = await launchesDB.updateOne({
        flightNumber: id
    },{
        success:false,
        upcoming:false
    });

    return aborted.modifiedCount === 1;

}

module.exports = {

    getAllLaunches,
    loadLaunchesData,
    scheduleNewLaunch,
    existLaunchById,
    abortLaunchById
};