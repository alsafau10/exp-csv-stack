const {launches, getAllLaunches, addNewLaunch, existLaunchById, abortLaunchById, scheduleNewLaunch} = require('../../models/launch.model');

async function httpGetAllLaunches(req,res){
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewData(req,res){
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    await scheduleNewLaunch(launch);
    res.status(201).json(launch);
}

function httpAbortData(req, res ){
    const {
        params:{
            id
        }
    } = req;

    const idLaunches = Number(id);
    if (!existLaunchById(idLaunches)){
        return res.status(400).json({
            status:'fail',
            message:'Launch does\'nt exist'
        });
    }
    const abort = abortLaunchById(idLaunches);
    return res.status(200).json(abort);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewData,
    httpAbortData
    
}