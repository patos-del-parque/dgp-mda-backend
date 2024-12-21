const express = require('express');
const Materials = require('../models/Materials');
const router = express.Router();

/**
 * Obtiene todos los materiales disponibles en la bd.
 * 
 * @route GET /materials/get
 * @returns {Object} 200 - Lista de materiales.
 * @returns {Object} 500 - Error al obtener los materiales.
 * @example
 * // Ejemplo de solicitud
 * GET /materials/get
 */
router.get('/get', async (req, res) => {
    try {
        const materials = await Materials.find();
        res.status(200).json({ materials });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los materiales', details: error.message });
    }
});

/**
 * Registra un nuevo material.
 * 
 * @route POST /materials/add
 * @param {Object} req.body - Datos del nuevo material.
 * @param {string} req.body.nombre - Nombre del material.
 * @param {number} req.body.cantidad - Cantidad del material.
 * @param {string} req.body.imagen - Foto del material.
 * @returns {Object} 201 - Material registrado con éxito.
 * @returns {Object} 500 - Error al material el estudiante.
 * @example
 * // Ejemplo de solicitud
 * POST /materials/add
 * {
 *   "nombre": "Bolígrafos",
 *   "cantidad": 12,
 *   "imagen": "url/photo"
 * }
 */
router.post('/add', async (req, res) => {
    try {
        const { nombre, cantidad, imagen } = req.body;

        const newMaterial = new Materials({
            nombre,
            cantidad,
            imagen
        });

        await newMaterial.save();
        res.status(201).json({ message: 'Material registrado con éxito', material: newMaterial });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el material', details: error.message });
    }
});


/**
 * Actualiza los datos de un material.
 * 
 * @route PUT /materials/update
 * @param {Object} req.body - Nuevos datos del material.
 * @param {string} req.body.currentName - Nombre actual del material (para buscarlo).
 * @param {string} req.body.nombre - Nuevo nombre del material.
 * @param {number} req.body.cantidad - Nueva cantidad del material
 * @param {string} req.body.imagen - Nueva imagen del material.
 * @returns {Object} 200 - Material actualizado con éxito.
 * @returns {Object} 404 - Material no encontrado para actualizar.
 * @returns {Object} 500 - Error al actualizar el material.
 * @example
 * // Ejemplo de solicitud
 * PUT /materials/update
 * {
 *   "currentName": "Bolígrafo",
 *   "nombre": "Bolígrafo Actualizado",
 *   "cantidad": "16",
 *   "imagen": "newimagen.jpg"
 * }
 */
router.patch('/update', async (req, res) => {
    try {
        const { currentName, ...fieldsToUpdate } = req.body;
        Object.keys(fieldsToUpdate).forEach(
            key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );
        const updatedMaterial = await Materials.findOneAndUpdate(
            { nombre: currentName },
            fieldsToUpdate,
            { new: true }
        );

        if (!updatedMaterial) {
            return res.status(404).json({ message: 'Material no encontrado para actualizar' });
        }

        res.status(200).json({ message: 'Material actualizado con éxito', material: updatedMaterial });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el material', details: error.message });
    }
});

/**
 * Actualiza la cantidad de un material.
 * 
 * @route PATCH /materials/update
 * @param {Object} req.body - Nuevos datos del material.
 * @param {string} req.body.currentName - Nombre actual del material (para buscarlo).
 * @param {number} req.body.cantidad - Nueva cantidad del material
 * @returns {Object} 200 - Material actualizado con éxito.
 * @returns {Object} 404 - Material no encontrado para actualizar.
 * @returns {Object} 500 - Error al actualizar el material.
 * @example
 * // Ejemplo de solicitud
 * PATCH /materials/update
 * {
 *   "currentName": "Bolígrafo",
 *   "cantidad": "16"
 * }
 */
router.patch('/updateCantidad', async (req, res) => {
    try {
        const { currentName, cantidad } = req.body;
        const updatedMaterial = await Materials.findOneAndUpdate(
            { nombre: currentName },
            { cantidad },
            { new: true }
        );

        if (!updatedMaterial) {
            return res.status(404).json({ message: 'Material no encontrado para actualizar' });
        }

        res.status(200).json({ message: 'Material actualizado con éxito', student: updatedMaterial });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el Material', details: error.message });
    }
});


// Ruta para eliminar un por su ID
router.delete('/delete', async (req, res) => {
    try {
        const { nombre } = req.body;
        const deleteMaterial = await Materials.findOneAndDelete({ "nombre": nombre });

        if (!deleteMaterial) {
            return res.status(404).json({ message: 'Material no encontrado para eliminar' });
        }

        res.status(201).json({ message: 'Material eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el material', details: error.message });
    }
  });

module.exports = router;
