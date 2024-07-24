const {launches, getAllLaunches, addNewLaunch, existLaunchById, abortLaunchById} = require('../../models/launch.model');

function httpGetAllLaunches(req,res){
    return res.status(200).json(getAllLaunches());
}

function httpAddNewData(req,res){
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    addNewLaunch(launch);
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