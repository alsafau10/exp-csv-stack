const mongoose = require('mongoose');


const planetsSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    keplerName:{
        type:String,
        required:true
    }
});
//concect launcges schema with the launches collection
module.exports = mongoose.model('planet',planetsSchema);