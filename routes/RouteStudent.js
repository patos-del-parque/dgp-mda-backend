const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Crear un nuevo estudiante
router.post('/add', async (req, res) => {
    try {
        const { nombre, aula , password, lectura, imagen, video } = req.body;
    
        // Crear un nuevo estudiante
        const newStudent = new Student({
          nombre,
          aula,
          password,
          lectura,
          imagen,
          video
        });

        await newStudent.save();
        res.status(201).json({ message: 'Estudiante registrado con éxito', student: newStudent });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el estudiante', details: error.message });
    }
});

// Obtener todos los estudiantes••••
router.get('/get', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes', details: error.message });
    }
});

// Obtener un estudiante por su ID
router.get('/get/:name', async (req, res) => {
try {
    const student = await Student.find({nombre: req.params.nombre});

    if (!student) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json({ student });
} catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudiante', details: error.message });
}
});

// Actualizar un estudiante por su ID
router.put('/update', async (req, res) => {

    try {
        const { currentName, nombre, aula, password, lectura, imagen, video } = req.body;
        const updatedStudent = await Student.findOneAndUpdate(
            { nombre: currentName},
            { nombre: nombre, aula: aula, password: password, lectura: lectura, imagen: imagen, video: video },
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
router.delete('/delete', async (req, res) => {
try {
    const { nombre } = req.body;
    const deletedStudent = await Student.findOneAndDelete({"nombre" : nombre});

    if (!deletedStudent) {
        return res.status(404).json({ message: 'Estudiante no encontrado para eliminar' });
    }

    res.status(201).json({ message: 'Estudiante eliminado con éxito' });
} catch (error) {
    res.status(500).json({ error: 'Error al eliminar el estudiante', details: error.message });
}
});

// Hacer login
router.post('/login', async (req, res) => {
    try {
      const { nombre, password } = req.body;
  
      const student = await Student.findOne({"nombre" : nombre});
      if (!student) {
        return res.status(404).json({ success: false, message: 'student no encontrado' });
      }
  
      const isPasswordValid = student.password === password;
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
  
      // Login exitoso
      res.status(200).json({ success: true, message: 'Login exitoso', student });
  
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error en el login', details: error.message });
    }
});

module.exports = router;