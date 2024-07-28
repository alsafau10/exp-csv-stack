const {launches, getAllLaunches, addNewLaunch, existLaunchById, abortLaunchById, scheduleNewLaunch, loadLaunchesData} = require('../../models/launch.model');

async function httpGetAllLaunches(req,res){
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewData(req,res){
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    await scheduleNewLaunch(launch);
    res.status(201).json(launch);
}

async function httpAbortData(req, res ){
    const {
        params:{
            id
        }
    } = req;

    const idLaunches = Number(id);

    try{
        const existId = await existLaunchById(idLaunches);    
        if (!existId){
            return res.status(400).json({
                status:'fail',
                message:'Launch does\'nt exist'
            });
        }
        const abort = await abortLaunchById(idLaunches);

        if(!abort){
            return res.status(400).json({
                status:'fail',
                message:'launch couldnt be aborted'
            });
        }
        return res.status(200).json({
            status:'success',
            message:'Launched has been aborted'
        });
}catch(err){
    console.error('error', err);
}}

async function httpGetSpaceXData(req,res){
    const data = await loadLaunchesData();
    if (!data) {
        return res.status(400).json({
            status:'fail',
            message:'unable fetch data'
        });
    }
    return res.status(200).send(data);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewData,
    httpAbortData,
    httpGetSpaceXData
    
}