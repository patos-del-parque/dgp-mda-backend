const express = require('express');
const Menu = require('../models/Menu');
const router = express.Router();

// Crear un nuevo menú
router.post('/add-menu', async (req, res) => {
    try {
        const { nombre, tipoComida, ingredientes, alergenos, horarioApertura, horarioCierre } = req.body;

        const newMenu = new Menu({
            nombre,
            tipoComida,
            ingredientes,
            alergenos,
            horarioApertura,
            horarioCierre
        });

        await newMenu.save();
        res.status(201).json({ message: 'Menú creado con éxito', menu: newMenu });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el menú', details: error.message });
    }
});

// Obtener todos los menús
router.get('/get-menus', async (req, res) => {
    try {
        const menus = await Menu.find();
        res.status(200).json({ menus });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los menús', details: error.message });
    }
});

// Obtener un menú por su ID
router.get('/get-menu/:id', async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({ message: 'Menú no encontrado' });
        }

        res.status(200).json({ menu });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el menú', details: error.message });
    }
});

// Actualizar un menú por su ID
router.put('/update-menu/:id', async (req, res) => {
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedMenu) {
            return res.status(404).json({ message: 'Menú no encontrado' });
        }

        res.status(200).json({ message: 'Menú actualizado con éxito', menu: updatedMenu });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el menú', details: error.message });
    }
});

// Eliminar un menú por su ID
router.delete('/delete-menu/:id', async (req, res) => {
    try {
        const deletedMenu = await Menu.findByIdAndDelete(req.params.id);

        if (!deletedMenu) {
            return res.status(404).json({ message: 'Menú no encontrado' });
        }

        res.status(200).json({ message: 'Menú eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el menú', details: error.message });
    }
});

module.exports = router;