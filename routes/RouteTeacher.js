const express = require('express');
const Teacher = require('../models/Teacher'); // Importa el modelo Teacher
const router = express.Router();

// Crear un nuevo teacher
router.post('/add', async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const newTeacher = new Teacher({
      nombre,
      password
    });

    await newTeacher.save();
    //res.status(201).json(newTeacher);
    res.status(201).json({ message: 'Profesor registrado con éxito', teacher: newTeacher });
  } catch (error) {
    //res.status(400).json({ error: error.message });
    res.status(500).json({ error: 'Error al registrar al profesor', details: error.message });
  }
});

// Obtener todos los teachers

router.get('/get', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(201).json(teachers);
  } catch (error) {
    res.status(500).json({  error: 'Error al obtener los profesores', details: error.message });
  }
});


// Obtener un teacher por nombre
/* router.get('/get-teachers/:name', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({nombre: req.params.nombre});
    if (!teacher) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({  error: 'Error al obtener el profesor', details: error.message });
  }
}); */

 // Actualizar un teacher por nombre
router.put('/update', async (req, res) => {
  
  const { currentName, newName, newPassword } = req.body;

  // Validar entrada
  if (!currentName || !newName || !newPassword) {
    return res.status(400).json({
      message: 'Se requieren el nombre actual, el nuevo nombre y la nueva contraseña.',
    });
  }

  try {
    // Cifrar la nueva contraseña
    //const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Buscar y actualizar el profesor por nombre
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { nombre: currentName }, // Filtro para encontrar al profesor
      { nombre: newName, password: newPassword }, // Datos a actualizar
      { new: true, runValidators: true } // Opciones
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    res.status(201).json({
      message: 'Profesor actualizado exitosamente.',
      updatedTeacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el profesor.', error });
  }
});

// Eliminar un teacher por ID
router.delete('/delete', async (req, res) => {
  try {
    const { nombre } = req.body;
    const teacher = await Teacher.findOneAndDelete({"nombre" : nombre});
    if (!teacher) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.status(201).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error; No ha sido posible eliminar el profesor', details: error.message  });
  }
}); 

// Hacer login
router.post('/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const teacher = await Teacher.findOne({"nombre" : nombre});
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
    }

    const isPasswordValid = teacher.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // Login exitoso
    res.status(200).json({ success: true, message: 'Login exitoso', teacher });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el login', details: error.message });
  }
});

module.exports = router;
