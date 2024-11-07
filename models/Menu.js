const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    nombre: {
        type: String, 
        required: true
    }, 
    tipoComida: {
        type: String,
        required: true
    },  
    ingredientes: [String],
    alergenos: [String],
    horarioApertura: {
        type: String,
        required: true
    },
    horarioCierre: {
        type: String,
        required: true
    },
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;