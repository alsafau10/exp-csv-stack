const express = require('express');
const { httpGetAllLaunches, httpAddNewData, httpAbortData} = require('./launches.controller');


const launchesRouter = express.Router();

launchesRouter.get('/launches',httpGetAllLaunches);
launchesRouter.post('/launches',httpAddNewData);
launchesRouter.delete('/launches/:id',httpAbortData);

module.exports = {
    launchesRouter
}