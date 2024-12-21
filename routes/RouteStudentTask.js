const express = require('express');
const StudentTask = require('../models/StudentTask');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route POST /assign-task
 * @description Crear una nueva asignación de tarea para un estudiante
 * @body { studentId: String, taskId: String }
 * @response { 
 *   message: 'Tarea asignada con éxito', 
 *   assignment: Object 
 * }
 * @error 500 { error: 'Error al asignar la tarea', details: String }
 */
router.post('/assign-task', async (req, res) => {
    try {
        const { studentId, taskId, tipoVista } = req.body;

        const newAssignment = new StudentTask({
            studentId,
            taskId,
            realizada: false, // inicialmente no se ha realizado
            tipoVista
        });

        await newAssignment.save();
        res.status(201).json({ message: 'Tarea asignada con éxito', assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar la tarea', details: error.message });
    }
});

/**
 * @route GET /get-tasks/:studentId
 * @description Obtener todas las tareas asignadas a un estudiante
 * @param { String } studentId - ID del estudiante
 * @response { 
 *   tasks: Array 
 * }
 * @error 404 { message: 'No se han encontrado tareas para este estudiante' }
 * @error 500 { error: 'Error al obtener las tareas del estudiante', details: String }
 */
router.get('/get/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Validar si el studentId es un ObjectId válido

        // Buscar tareas relacionadas con el studentId
        const tasks = await StudentTask.find({ studentId })
            .populate('taskId', 'nombre imagenTarea pasos') // Traer solo los campos nombre e imagenTarea de la tarea
            .select('taskId realizada'); // Seleccionar solo la referencia a taskId

        // Verificar si existen tareas para el estudiante
        if (!tasks.length) {
            return res.status(404).json({ message: 'No se han encontrado tareas para este estudiante' });
        }

        // Mapear las tareas para obtener solo los datos que necesitamos
        const result = tasks.map(task => ({
            taskId: task.taskId._id,
            taskName: task.taskId.nombre,
            taskImage: task.taskId.imagenTarea,
            taskPasos: task.taskId.pasos,
            taskRealizada: task.realizada,
        }));

        // Responder con las tareas y sus campos relevantes
        res.status(200).json({ tasks: result });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas del estudiante', details: error.message });
    }
});

/**
 * @route PUT /mark-task-as-done/:studentTaskId
 * @description Marcar una tarea como realizada
 * @param { String } studentTaskId - ID de la asignación de tarea
 * @response { 
 *   message: 'Tarea marcada como realizada', 
 *   assignment: Object 
 * }
 * @error 404 { message: 'Asignación de tarea no encontrada' }
 * @error 500 { error: 'Error al marcar la tarea como realizada', details: String }
 */
router.put('/mark-as-done/:studentId/:taskId', async (req, res) => {
    try {
        const { studentId, taskId } = req.params;

        // Buscar la tarea del estudiante en la base de datos
        const updatedAssignment = await StudentTask.findOneAndUpdate(
            { studentId: mongoose.Types.ObjectId(studentId), taskId: mongoose.Types.ObjectId(taskId) }, // Buscar por ID del estudiante y ID de la tarea
            { realizada: true }, // Actualizar el estado a 'realizada: true'
            { new: true } // Retornar el documento actualizado
        );

        // Verificar si se encontró la asignación de tarea
        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Tarea del estudiante no encontrada' });
        }

        // Respuesta exitosa con los detalles de la tarea actualizada
        res.status(200).json({ 
            message: 'Tarea marcada como realizada', 
            assignment: updatedAssignment 
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ 
            error: 'Error al marcar la tarea como realizada', 
            details: error.message 
        });
    }
});

/**
 * @route DELETE /delete-task/:studentTaskId
 * @description Eliminar una asignación de tarea
 * @param { String } studentTaskId - ID de la asignación de tarea
 * @response { message: 'Asignación de tarea eliminada con éxito' }
 * @error 404 { message: 'Asignación de tarea no encontrada' }
 * @error 500 { error: 'Error al eliminar la asignación de tarea', details: String }
 */
/*router.delete('/delete/:studentTaskId', async (req, res) => {
    try {
        const studentTaskId = req.params.studentTaskId;

        const deletedAssignment = await StudentTask.findOneAndDelete({"studentTaskId" : studentTaskId});

        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Asignación de tarea no encontrada' });
        }

        res.status(200).json({ message: 'Asignación de tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la asignación de tarea', details: error.message });
    }
});*/

router.delete('/delete/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        // Buscar y eliminar la tarea asignada
        const deletedTask = await StudentTask.deleteMany({
            taskId: mongoose.Types.ObjectId(taskId),
        });

        // Validar si se eliminó correctamente
        if (!deletedTask) {
            return res.status(404).json({ 
                message: 'Tarea asignada no encontrada',
            });
        }

        // Responder con éxito
        res.status(200).json({
            message: 'Tarea asignada eliminada exitosamente',
            deletedTask,
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            error: 'Error al eliminar la tarea asignada',
            details: error.message,
        });
    }
});

module.exports = router;
