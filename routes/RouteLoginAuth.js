const express = require('express');
const Student = require('../models/Student');
const router = express.Router();
import {login} from '../controller/ControllerLogin';

export const register = async(req,res) =>{

}
router.post('/login',validateSchema(loginSchema,login));

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
