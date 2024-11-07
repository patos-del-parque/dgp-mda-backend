const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Añadir una tarea nueva
router.post('/add-task', async (req, res) => {
    try {
        const newTask = new Task({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            pasos: req.body.pasos,
            fechaCreacion: new Date(), // Se puede omitir
        });
        
        await newTask.save(); 
        res.status(201).json({ message: 'Menú registrado con éxito', task: newTask });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el menú', details: error.message });
    }
});

// Obtener todas las tareas
router.get('/get-tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas', details: error.message });
    }
});

// Obtener una tarea por su ID
router.get('/get-task/:taskId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea', details: error.message });
    }
});

// Actualizar una tarea por su ID
router.put('/update-task/:taskId', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                pasos: req.body.pasos,
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada para actualizar' });
        }

        res.status(200).json({ message: 'Tarea actualizada con éxito', task: updatedTask });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea', details: error.message });
    }
});

// Eliminar una tarea por su ID
router.delete('/delete-task/:taskId', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada para eliminar' });
        }

        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea', details: error.message });
    }
});

module.exports = router;