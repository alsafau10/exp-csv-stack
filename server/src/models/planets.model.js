const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');

const planets = require('./planets.mongo');


function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

/*

*/
function loadPlanetsData(){
    return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanet = (await getAllPlanetsModel()).length ;
        console.log(`${countPlanet} habitable planets found!`);
        resolve();
      });
    });
}


async function getAllPlanetsModel(){
  return await planets.find({
  },{
    //projection will exclude specific element of the object,
    //if the value === 1 it will only shows the key with the value of 1
    _id:0,__v:0
  });
}

async function savePlanet(data){
  try{
  await planets.updateOne({
    id:data.kepid,
    keplerName:data.kepler_name
  },{
    id:data.kepid,
    keplerName:data.kepler_name
  },{
    upsert:true
  });
}
  catch(err){
    console.error(
      `couldnt save planets ${err}`
    )
  }
}
module.exports = {
    loadPlanetsData,
    getAllPlanetsModel,
};