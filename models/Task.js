const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, 
    descripcion: { type: String, required: true },
    pasos: {type: Array, required:true},
    fechaCreacion: { type: Date, default: Date.now },
    
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;