const express = require('express');
const { httpGetAllLaunches, httpAddNewData, httpAbortData, httpGetSpaceXData} = require('./launches.controller');


const launchesRouter = express.Router();

launchesRouter.get('/launches',httpGetAllLaunches);
launchesRouter.get('/launches/space',httpGetSpaceXData);
launchesRouter.post('/launches',httpAddNewData);
launchesRouter.delete('/launches/:id',httpAbortData);


module.exports = launchesRouter;
