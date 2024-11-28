const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const studentRoutes = require('./routes/RouteStudent');
const taskRoutes = require('./routes/RouteTask');
const studentTaskRoutes = require('./routes/RouteStudentTask');
const adminRoutes = require('./routes/RouteAdmin');
const teacherRoutes = require('./routes/RouteTeacher');

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
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/student-tasks', studentTaskRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Simulacion del login, después se hara con la base de datos
    const administradores = [
        { email: 'pedro@example.com', password: '123' },
        { email: 'alonso@example.com', password: 'password456' },
        { email: 'carlos@example.com', password: 'password789' }
    ];

    const admin = administradores.find((a) => a.email === email && a.password === password);
    //const profesor = profesores.find((b) => b.email === email && b.password === password);

    if (admin) {
        res.json({ success: true, role: 'admin', message: 'Inicio de sesión correcto' });
    } else {
        //res.status(401).json({ invalid: true, incorrectTimes: 0, message: 'Correo o contraseña incorrectos' });
        res.status(401).json({ succes: false, message: 'Correo o contraseña incorrectos' });
    }
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend API!', usingAPI: true });
});

app.listen(PORT, () => {
    console.log('Server running on https://api.jsdu9873.tech/api/');
});