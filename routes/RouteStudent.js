const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Crear un nuevo estudiante
router.post('/add-student', async (req, res) => {
    try {
        const newStudent = new Student({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            DNI: req.body.DNI,
            curso: req.body.curso,
            edad: req.body.edad,
            niveles: req.body.niveles,
            password: req.body.password,
        });

        await newStudent.save();
        res.status(201).json({ message: 'Estudiante registrado con éxito', student: newStudent });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el estudiante', details: error.message });
    }
});

// Obtener todos los estudiantes
router.get('/get-students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes', details: error.message });
    }
});

// Obtener un estudiante por su ID
router.get('/get-student/:studentId', async (req, res) => {
try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json({ student });
} catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudiante', details: error.message });
}
});

// Actualizar un estudiante por su ID
router.put('/update-student/:studentId', async (req, res) => {
try {
    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.studentId,
        {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            DNI: req.body.DNI,
            curso: req.body.curso,
            edad: req.body.edad,
            niveles: req.body.niveles,
            password: req.body.password,
        },
        { new: true }
    );

    if (!updatedStudent) {
        return res.status(404).json({ message: 'Estudiante no encontrado para actualizar' });
    }

    res.status(200).json({ message: 'Estudiante actualizado con éxito', student: updatedStudent });
} catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estudiante', details: error.message });
}
});

// Eliminar un estudiante por su ID
router.delete('/delete-student/:studentId', async (req, res) => {
try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.studentId);

    if (!deletedStudent) {
        return res.status(404).json({ message: 'Estudiante no encontrado para eliminar' });
    }

    res.status(200).json({ message: 'Estudiante eliminado con éxito' });
} catch (error) {
    res.status(500).json({ error: 'Error al eliminar el estudiante', details: error.message });
}
});

module.exports = router;