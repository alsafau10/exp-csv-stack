const http = require('http') ;
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv/config');

const {loadPlanetsData} = require('./models/planets.model');

const PORT = process.argv.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);

const server = http.createServer(app);

mongoose.connection.once('open', ()=>{
    console.info(('Mongo connected'));
})

mongoose.connection.on('error',(error)=>{
    console.error(error);
})

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(PORT, ()=>{
        console.log(`listening on ${PORT}`);
    })    
}

startServer();
