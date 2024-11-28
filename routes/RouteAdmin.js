const express = require('express');
const Admin = require('../models/Admin'); // Importa el modelo Admin
const router = express.Router();

// Crear un nuevo admin
router.post('/add', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const newAdmin = new Admin({
      nombre,
      password
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Administrador registrado con éxito', admin: newAdmin });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar el admin', details: error.message });
  }
});

// Obtener todos los admins
router.get('/get', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los admins', details: error.message });
  }
});

// Obtener un admin por ID
router.get('/get/:name', async (req, res) => {
  try {
    const admin = await Admin.find({ nombre: req.params.nombre });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el admin', details: error.message });
  }
});

// Actualizar un admin por ID
router.put('/update/:name', async (req, res) => {
  try {
    const admin = await Admin.findOneAndUpdate(
      { nombre: req.params.nombre }, // Condición para buscar por 'nombre'
      req.body, // Datos a actualizar
      { new: true, runValidators: true } // Opciones
    );
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un admin por nombre
router.delete('/delete/:name', async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({ nombre: req.params.name });

    if (!admin) return res.status(404).json({ error: 'Admin no encontrado' });

    res.status(200).json({ message: 'Admin borrado correctamente', admin });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el admin', details: error.message });
  }
});

// Hacer login
router.post('/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const admin = await Admin.findOne({"nombre" : nombre});
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin no encontrado' });
    }

    const isPasswordValid = admin.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // Login exitoso
    res.status(200).json({ success: true, message: 'Login exitoso', admin });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el login', details: error.message });
  }
});

module.exports = router;
