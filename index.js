const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const studentRoutes = require('./routes/RouteStudent');
const taskRoutes = require('./routes/RouteTask');
const studentTaskRoutes = require('./routes/RouteStudentTask');
const menuRoutes = require('./routes/RouteMenu');

const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb://mongoadmin:admin@mongo-db:27017';

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

    
app.use(cors());
app.use(express.json());


// Rutas
app.use('/api/students', studentRoutes); // Rutas de estudiantes
app.use('/api/tasks', taskRoutes);       // Rutas de tareas
app.use('/api/student-tasks', studentTaskRoutes); // Rutas de relaciones estudiante-tarea
app.use('/api/menus', menuRoutes);       // Rutas de menús

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Simulacion del login, después se hara con la base de datos
    const administradores = [
        { email: 'pedro@example.com', password: '123' },
        { email: 'alonso@example.com', password: 'password456' },
        { email: 'carlos@example.com', password: 'password789' }
    ];

    const admin = administradores.find((a) => a.email === email && a.password === password);

    if (admin) {
        res.json({ success: true, message: 'Inicio de sesión correcto' });
    } else {
        res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend API!', usingAPI: true });
});

app.listen(PORT, () => {
    console.log('Server running on https://api.jsdu9873.tech/api/');
});