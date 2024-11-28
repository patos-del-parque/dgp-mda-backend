const mongoose = require('mongoose');


const materialSquema = new mongoose.Schema({
    nombre: {type: String, requiered: True},
    cantidad: {type: Number, requiered: True}, 
})

const materialsSchema = new mongoose.Schema({
  material: [materialSquema],
});

const Materials = mongoose.model('Materials', materialsSchema);

module.exports = Materials;
