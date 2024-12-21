const express = require('express');
const Task = require('../models/Task');
//const StudentTask = require('../models/StudentTask');
const router = express.Router();
const mongoose = require('mongoose');
/**
 * @route POST /add
 * @description Añadir una tarea nueva
 * @body { nombre: String, fechaCreacion: Date, imagenTarea: String, pasos: Array }
 * @response { 
 *   message: 'Menú registrado con éxito', 
 *   task: Object 
 * }
 * @error 500 { error: 'Error al registrar el menú', details: String }
 */
router.post('/add', async (req, res) => {
    try {
        const { nombre, fechaCreacion, imagenTarea, pasos } = req.body;

        const newTask = new Task({
            nombre,
            fechaCreacion,
            imagenTarea,
            pasos
        });
        
        await newTask.save(); 
        res.status(201).json({ message: 'Tarea registrado con éxito', task: newTask });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la tarea', details: error.message });
    }
});

/**
 * @route GET /get
 * @description Obtener todas las tareas
 * @response { tasks: Array }
 * @error 500 { error: 'Error al obtener las tareas', details: String }
 */
router.get('/get', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas', details: error.message });
    }
});

/**
 * @route GET /get/:taskId
 * @description Obtener una tarea por su ID
 * @param { String } taskId - ID de la tarea
 * @response { task: Object }
 * @error 404 { message: 'Tarea no encontrada' }
 * @error 500 { error: 'Error al obtener la tarea', details: String }
 */
router.get('/get/:taskId', async (req, res) => {
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

/**
 * Obtiene una tarea por su nombre.
 * 
 * @route GET /student/get/:name
 * @param {string} req.params.name - Nombre de la tarea.
 * @returns {Object} 200 - Tarea encontrado.
 * @returns {Object} 404 - Tarea no encontrado.
 * @returns {Object} 500 - Error al obtener la tarea.
 * @example
 * // Ejemplo de solicitud
 * GET /tasks/get/Tarea
 */
/* router.get('/get/:name', async (req, res) => {
    try {
        const taskName = req.params.name;
        const task = await Task.findOne({"nombre": taskName});

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada'});
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea ', details: error.message });
    }
}); */

/**
 * @route PATCH /update/:taskId
 * @description Actualizar una tarea por su ID
 * @param { String } taskId - ID de la tarea
 * @body { nombre: String, descripcion: String, pasos: Array }
 * @response { 
 *   message: 'Tarea actualizada con éxito', 
 *   task: Object 
 * }
 * @error 404 { message: 'Tarea no encontrada para actualizar' }
 * @error 500 { error: 'Error al actualizar la tarea', details: String }
 */
router.patch('/update', async (req, res) => {
    try {
        const { taskNameOriginal, ...fieldsToUpdate } = req.body;

        Object.keys(fieldsToUpdate).forEach(
            key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const updatedTask = await Task.findOneAndUpdate(
            {nombre: taskNameOriginal},
            fieldsToUpdate,
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

/**
 * @route DELETE /delete/:taskId
 * @description Eliminar una tarea por su ID
 * @param { String } taskId - ID de la tarea
 * @response { message: 'Tarea eliminada con éxito' }
 * @error 404 { message: 'Tarea no encontrada para eliminar' }
 * @error 500 { error: 'Error al eliminar la tarea', details: String }
 */
router.delete('/delete/:taskId', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
        //const deletedStudenTask = await StudenTask.findByIdAndDelete(req.params.taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada para eliminar' });
        }

        /*if (!deletedStudenTask) {
            return res.status(404).json({ message: 'Tarea no encontrada para eliminar' });
        }*/

        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea', details: error.message });
    }
});

module.exports = router;
