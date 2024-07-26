const {getAllPlanetsModel} = require('../../models/planets.model');
async function getAllPlanets (req,res){
    return res.status(200).json(await getAllPlanetsModel());
}

module.exports = {getAllPlanets};