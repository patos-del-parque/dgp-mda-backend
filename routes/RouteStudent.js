const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

/**
 * Registra un nuevo estudiante.
 * 
 * @route POST /student/add
 * @param {Object} req.body - Datos del nuevo estudiante.
 * @param {string} req.body.nombre - Nombre del estudiante.
 * @param {string} req.body.aula - Aula del estudiante.
 * @param {string} req.body.password - Contraseña del estudiante.
 * @param {boolean} req.body.lectura - Preferencia de lectura del estudiante.
 * @param {string} req.body.imagen - Imagen asociada al estudiante.
 * @param {string} req.body.video - Video asociado al estudiante.
 * @returns {Object} 201 - Estudiante registrado con éxito.
 * @returns {Object} 500 - Error al registrar el estudiante.
 * @example
 * // Ejemplo de solicitud
 * POST /student/add
 * {
 *   "nombre": "Juan Pérez",
 *   "aula": "A1",
 *   "password": "password123",
 *   "lectura": true,
 *   "imagen": "imagen.jpg",
 *   "video": "video.mp4"
 *    "comedor": "false"
 * }
 */
router.post('/add', async (req, res) => {
    try {
        const { nombre, aula, password, avatar, lectura, imagen, video, comedor } = req.body;

        const newStudent = new Student({
            nombre,
            aula,
            password,
            avatar,
            lectura,
            imagen,
            video,
            comedor
        });

        await newStudent.save();
        res.status(201).json({ message: 'Estudiante registrado con éxito', student: newStudent });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el estudiante', details: error.message });
    }
});

/**
 * Obtiene todos los estudiantes.
 * 
 * @route GET /student/get
 * @returns {Object} 200 - Lista de estudiantes.
 * @returns {Object} 500 - Error al obtener los estudiantes.
 * @example
 * // Ejemplo de solicitud
 * GET /student/get
 */
router.get('/get', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes', details: error.message });
    }
});

router.get('/get-id/:name', async (req, res) => {
    try {
        const studentName = req.params.name;
        const student = await Student.findOne({"nombre": studentName});

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado sdsd ${studentName}'});
        }

        res.status(200).json({ studentId: student._id });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes', details: error.message });
    }
});

/**
 * Obtiene un estudiante por su nombre.
 * 
 * @route GET /student/get/:name
 * @param {string} req.params.name - Nombre del estudiante.
 * @returns {Object} 200 - Estudiante encontrado.
 * @returns {Object} 404 - Estudiante no encontrado.
 * @returns {Object} 500 - Error al obtener el estudiante.
 * @example
 * // Ejemplo de solicitud
 * GET /students/get/juan-perez
 */
router.get('/get/:name', async (req, res) => {
    try {
        const studentName = req.params.name;
        const student = await Student.findOne({"nombre": studentName});

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado sdsd ${studentName}'});
        }

        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estudiante ', details: error.message });
    }
});

/**
 * Obtiene la constraseña de un estudiante por su nombre.
 * 
 * @route GET /student/get/:name
 * @param {string} req.params.name - Nombre del estudiante.
 * @returns {Object} 200 - Estudiante encontrado.
 * @returns {Object} 404 - Estudiante no encontrado.
 * @returns {Object} 500 - Error al obtener el estudiante.
 * @example
 * // Ejemplo de solicitud
 * GET /student/get-password/juan-perez
 */
router.get('/get-password/:name', async (req, res) => {
    try {
        const student = await Student.findOne({ nombre: req.params.name });

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Supongamos que student.password es un string como '1234'
        const passwordString = student.password; // Esto es el string, por ejemplo: '1234'

        // Convertimos el string en un arreglo de números
        const passwordArray = passwordString.split('').map(Number); // [1, 2, 3, 4]

        res.status(200).json({ password: passwordArray }); // Devolvemos el arreglo
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estudiante', details: error.message });
    }
});

/**
 * Actualiza los datos de un estudiante.
 * 
 * @route PATCH /student/update
 * @param {Object} req.body - Nuevos datos del estudiante.
 * @param {string} req.body.currentName - Nombre actual del estudiante (para buscarlo).
 * @param {string} req.body.nombre - Nuevo nombre del estudiante.
 * @param {string} req.body.aula - Nueva aula del estudiante.
 * @param {string} req.body.password - Nueva contraseña del estudiante.
 * @param {boolean} req.body.lectura - Nueva preferencia de lectura.
 * @param {string} req.body.imagen - Nueva imagen del estudiante.
 * @param {string} req.body.video - Nuevo video del estudiante.
 * @returns {Object} 200 - Estudiante actualizado con éxito.
 * @returns {Object} 404 - Estudiante no encontrado para actualizar.
 * @returns {Object} 500 - Error al actualizar el estudiante.
 * @example
 * // Ejemplo de solicitud
 * PUT /student/update
 * {
 *   "currentName": "Juan Pérez",
 *   "nombre": "Juan Pérez Actualizado",
 *   "aula": "A2",
 *   "password": "newpassword",
 *   "lectura": false,
 *   "imagen": "newimagen.jpg",
 *   "video": "newvideo.mp4"
 * }
 */
router.patch('/update', async (req, res) => {
    try {
        const { currentName, ...fieldsToUpdate } = req.body;
        Object.keys(fieldsToUpdate).forEach(
            key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );
        const updatedStudent = await Student.findOneAndUpdate(
            { nombre: currentName },
            fieldsToUpdate,
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

/**
 * Elimina un estudiante por su nombre.
 * 
 * @route DELETE /student/delete
 * @param {Object} req.body - Datos del estudiante a eliminar.
 * @param {string} req.body.nombre - Nombre del estudiante a eliminar.
 * @returns {Object} 201 - Estudiante eliminado con éxito.
 * @returns {Object} 404 - Estudiante no encontrado para eliminar.
 * @returns {Object} 500 - Error al eliminar el estudiante.
 * @example
 * // Ejemplo de solicitud
 * DELETE /student/delete
 * {
 *   "nombre": "Juan Pérez"
 * }
 */
router.delete('/delete', async (req, res) => {
    try {
        const { nombre } = req.body;
        const deletedStudent = await Student.findOneAndDelete({ "nombre": nombre });

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Estudiante no encontrado para eliminar' });
        }

        res.status(201).json({ message: 'Estudiante eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el estudiante', details: error.message });
    }
});

/**
 * Realiza el login de un estudiante.
 * 
 * @route POST /student/login
 * @param {Object} req.body - Datos de login del estudiante.
 * @param {string} req.body.nombre - Nombre del estudiante.
 * @param {string} req.body.password - Contraseña del estudiante.
 * @returns {Object} 200 - Login exitoso.
 * @returns {Object} 404 - Estudiante no encontrado.
 * @returns {Object} 401 - Credenciales incorrectas.
 * @returns {Object} 500 - Error en el login.
 * @example
 * // Ejemplo de solicitud
 * POST /student/login
 * {
 *   "nombre": "Juan Pérez",
 *   "password": "password123"
 * }
 */
router.post('/login', async (req, res) => {
    try {
        const { nombre, password } = req.body;

        const student = await Student.findOne({ "nombre": nombre });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
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
