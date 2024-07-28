const express = require('express');

const  planetsRouter  = require('../routes/planets/planets.router');
const  launchesRouter = require('../routes/launches/launches.router');


const api = express.Router();
api.use( planetsRouter);
api.use( launchesRouter);

module.exports = api;

