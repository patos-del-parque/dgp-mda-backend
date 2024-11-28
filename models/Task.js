const mongoose = require('mongoose');

//Esquema de los pasos de la tarea
const StepSchema = new mongoose.Schema({
    name: { type: String, requiered: true},
    description: { type: String, required: true },
    imageUri: { type: String, required: false }, // Opcional
    /* videoUri: { type: String, required: false },  */// Opcional
});


//Esquema de las tareas
const taskSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, 
    fechaCreacion: { type: Date, default: Date.now },
    imagenTarea: { type: String, required: true }, 
    pasos: [StepSchema],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;