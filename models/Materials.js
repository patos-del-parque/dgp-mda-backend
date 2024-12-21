const mongoose = require('mongoose');


const materialSquema = new mongoose.Schema({
    nombre: {type: String, requiered: true},
    cantidad: {type: Number, requiered: true},
    imagen: {type: String, requiered: true}, 
})



const Materials = mongoose.model('Materials', materialSquema);

module.exports = Materials;
