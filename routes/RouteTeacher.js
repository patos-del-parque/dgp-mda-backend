const express = require('express');
const Teacher = require('../models/Teacher'); // Importa el modelo Teacher
const router = express.Router();

/**
 * @route POST /add
 * @description Crea un nuevo profesor.
 * @access Público
 * @param {string} nombre - Nombre del profesor.
 * @param {string} password - Contraseña del profesor.
 * @returns {object} Mensaje de éxito y datos del profesor creado o mensaje de error.
 */
router.post('/add', async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const newTeacher = new Teacher({ nombre, password });

    await newTeacher.save();
    res.status(201).json({ message: 'Profesor registrado con éxito', teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar al profesor', details: error.message });
  }
});

/**
 * @route GET /get
 * @description Obtiene la lista de todos los profesores.
 * @access Público
 * @returns {Array<object>} Lista de profesores o mensaje de error.
 */
router.get('/get', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los profesores', details: error.message });
  }
});

/**
 * @route PUT /update
 * @description Actualiza los datos de un profesor.
 * @access Público
 * @param {string} currentName - Nombre actual del profesor.
 * @param {string} newName - Nuevo nombre del profesor.
 * @param {string} newPassword - Nueva contraseña del profesor.
 * @returns {object} Mensaje de éxito y datos del profesor actualizado o mensaje de error.
 */
router.put('/update', async (req, res) => {
  const { currentName, newName, newPassword } = req.body;

  if (!currentName || !newName || !newPassword) {
    return res.status(400).json({
      message: 'Se requieren el nombre actual, el nuevo nombre y la nueva contraseña.',
    });
  }

  try {
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { nombre: currentName },
      { nombre: newName, password: newPassword },
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    res.status(201).json({
      message: 'Profesor actualizado exitosamente.',
      updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el profesor.', error });
  }
});

/**
 * @route DELETE /delete
 * @description Elimina un profesor por nombre.
 * @access Público
 * @param {string} nombre - Nombre del profesor a eliminar.
 * @returns {object} Mensaje de éxito o mensaje de error.
 */
router.delete('/delete', async (req, res) => {
  try {
    const { nombre } = req.body;
    const teacher = await Teacher.findOneAndDelete({ nombre });
    if (!teacher) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.status(201).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error; No ha sido posible eliminar el profesor', details: error.message });
  }
});

/**
 * @route POST /login
 * @description Realiza el login de un profesor.
 * @access Público
 * @param {string} nombre - Nombre del profesor.
 * @param {string} password - Contraseña del profesor.
 * @returns {object} Mensaje de éxito o mensaje de error con detalles.
 */
router.post('/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const teacher = await Teacher.findOne({ nombre });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
    }

    const isPasswordValid = teacher.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    res.status(200).json({ success: true, message: 'Login exitoso', teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el login', details: error.message });
  }
});

module.exports = router;