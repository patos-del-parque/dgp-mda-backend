const mongoose = require('mongoose');


const materialsRequestSquema = new mongoose.Schema({

    clase: { type: String, required: true },
    nombre: { 
        type: String, 
        required: true
    },
    cantidad: { 
        type: Number, 
        required: true
    },
    imagen :{
        type: String, 
        required: false
    }
});



const MaterialsRequest = mongoose.model('MaterialsRequest', materialsRequestSquema);

module.exports = MaterialsRequest;
