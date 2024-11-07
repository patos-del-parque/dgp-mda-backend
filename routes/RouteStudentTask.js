const express = require('express');
const StudentTask = require('../models/StudentTask');
const router = express.Router();

// Crear una nueva asignación de tarea
router.post('/assign-task', async (req, res) => {
    try {
        const { studentId, taskId } = req.body;

        const newAssignment = new StudentTask({
            studentId,
            taskId,
            realizada: false // inicialmente no se ha realizado
        });

        await newAssignment.save();
        res.status(201).json({ message: 'Tarea asignada con éxito', assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar la tarea', details: error.message });
    }
});

// Obtener todas las tareas asignadas a un estudiante
router.get('/get-tasks/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const tasks = await StudentTask.find({ studentId })
            .populate('taskId', 'nombre descripcion') // opcional, para obtener los detalles de la tarea
            .populate('studentId', 'nombre apellidos'); // opcional, para obtener los detalles del estudiante

        if (!tasks.length) {
            return res.status(404).json({ message: 'No se han encontrado tareas para este estudiante' });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas del estudiante', details: error.message });
    }
});

// Marcar tarea como realizada
router.put('/mark-task-as-done/:studentTaskId', async (req, res) => {
    try {
        const studentTaskId = req.params.studentTaskId;

        const updatedAssignment = await StudentTask.findByIdAndUpdate(
            studentTaskId,
            { realizada: true }, // Cambiar a 'true' si se ha realizado
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Asignación de tarea no encontrada' });
        }

        res.status(200).json({ message: 'Tarea marcada como realizada', assignment: updatedAssignment });
    } catch (error) {
        res.status(500).json({ error: 'Error al marcar la tarea como realizada', details: error.message });
    }
});

// Eliminar una asignación de tarea
router.delete('/delete-task/:studentTaskId', async (req, res) => {
    try {
        const studentTaskId = req.params.studentTaskId;

        const deletedAssignment = await StudentTask.findByIdAndDelete(studentTaskId);

        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Asignación de tarea no encontrada' });
        }

        res.status(200).json({ message: 'Asignación de tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la asignación de tarea', details: error.message });
    }
});

module.exports = router;
