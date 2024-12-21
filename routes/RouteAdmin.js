const express = require('express');
const Admin = require('../models/Admin'); // Importa el modelo Admin
const router = express.Router();

/**
 * Crea un nuevo administrador.
 * 
 * @route POST /admin/add
 * @param {Object} req.body - Datos del nuevo administrador.
 * @param {string} req.body.nombre - Nombre del administrador.
 * @param {string} req.body.password - Contraseña del administrador.
 * @returns {Object} 201 - El administrador se registró con éxito.
 * @returns {Object} 400 - Error al registrar el administrador.
 * @example
 * // Ejemplo de solicitud
 * POST /admin/add
 * {
 *   "nombre": "admin1",
 *   "password": "password123"
 * }
 */
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

/**
 * Obtiene todos los administradores.
 * 
 * @route GET /admin/get
 * @returns {Object} 200 - Lista de administradores.
 * @returns {Object} 500 - Error al obtener los administradores.
 * @example
 * // Ejemplo de solicitud
 * GET /admin/get
 */
router.get('/get', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los admins', details: error.message });
  }
});

/**
 * Obtiene un administrador por nombre.
 * 
 * @route GET /admin/get/:name
 * @param {string} name - El nombre del administrador a buscar.
 * @returns {Object} 200 - El administrador encontrado.
 * @returns {Object} 404 - Si no se encuentra el administrador.
 * @returns {Object} 500 - Error al obtener el administrador.
 * @example
 * // Ejemplo de solicitud
 * GET /admin/get/admin1
 */
router.get('/get/:name', async (req, res) => {
  try {
    const admin = await Admin.find({ nombre: req.params.nombre });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el admin', details: error.message });
  }
});

/**
 * Actualiza un administrador por nombre.
 * 
 * @route PUT /admin/update/:name
 * @param {string} name - El nombre del administrador a actualizar.
 * @param {Object} req.body - Datos a actualizar.
 * @param {string} req.body.nombre - Nombre del administrador (opcional).
 * @param {string} req.body.password - Nueva contraseña del administrador (opcional).
 * @returns {Object} 200 - El administrador actualizado.
 * @returns {Object} 404 - Si no se encuentra el administrador.
 * @returns {Object} 400 - Error al actualizar el administrador.
 * @example
 * // Ejemplo de solicitud
 * PUT /admin/update/admin1
 * {
 *   "password": "newPassword123"
 * }
 */
router.put('/update/:name', async (req, res) => {
  try {
    const admin = await Admin.findOneAndUpdate(
      { nombre: req.params.nombre },
      req.body,
      { new: true, runValidators: true }
    );
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Elimina un administrador por nombre.
 * 
 * @route DELETE /admin/delete/:name
 * @param {string} name - El nombre del administrador a eliminar.
 * @returns {Object} 200 - El administrador eliminado.
 * @returns {Object} 404 - Si no se encuentra el administrador.
 * @returns {Object} 500 - Error al eliminar el administrador.
 * @example
 * // Ejemplo de solicitud
 * DELETE /admin/delete/admin1
 */
router.delete('/delete/:name', async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({ nombre: req.params.name });

    if (!admin) return res.status(404).json({ error: 'Admin no encontrado' });

    res.status(200).json({ message: 'Admin borrado correctamente', admin });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el admin', details: error.message });
  }
});

/**
 * Realiza el login de un administrador.
 * 
 * @route POST /admin/login
 * @param {Object} req.body - Datos de login del administrador.
 * @param {string} req.body.nombre - Nombre del administrador.
 * @param {string} req.body.password - Contraseña del administrador.
 * @returns {Object} 200 - Login exitoso.
 * @returns {Object} 404 - Si no se encuentra el administrador.
 * @returns {Object} 401 - Si las credenciales son incorrectas.
 * @returns {Object} 500 - Error en el login.
 * @example
 * // Ejemplo de solicitud
 * POST /admin/login
 * {
 *   "nombre": "admin1",
 *   "password": "password123"
 * }
 */
router.post('/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const admin = await Admin.findOne({ "nombre": nombre });
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
