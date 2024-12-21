const express = require('express');
const Materials = require('../models/Materials');
const MaterialsRequest = require('../models/MaterialsRequest');
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
        const materialsRequest = await MaterialsRequest.find();
        res.status(200).json({ materialsRequest });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las solicitudes de materiales', details: error.message });
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
        const { clase, nombre, cantidad } = req.body;
        // Consulta para obtener el material con el nombre dado
        //Esto no va
        const material = await Materials.findOne({ nombre : String(nombre)});
         if (!material) {
            return res.status(404).json({ error: 'Material no encontrado' });
        }

        const newMaterialRequest = new MaterialsRequest({
            clase,
            nombre,
            cantidad,
            imagen: material.imagen
        });

        await newMaterialRequest.save();
        res.status(201).json({ message: 'Solicitud de material registrada con éxito', materialrequest: newMaterialRequest });
    } catch (error) {
       res.status(500).json({ error: 'Error al registrar la solicitud de material', details: error.message });
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
router.put('/update', async (req, res) => {
    try {
        const { currentName, nombre, cantidad, imagen } = req.body;
        const updatedMaterial = await Materials.findOneAndUpdate(
            { nombre: currentName },
            { nombre, cantidad, imagen },
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
        const deleteMaterial = await MaterialsRequest.findOneAndDelete({ "nombre": String(nombre) });

        if (!deleteMaterial) {
            return res.status(404).json({ message: 'Material no encontrado para eliminar' });
        }

        res.status(201).json({ message: 'Material eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el material', details: error.message });
    }
  });

module.exports = router;
