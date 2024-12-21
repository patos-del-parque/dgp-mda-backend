// Importación de dependencias necesarias para crear y configurar el servidor
const express = require('express');
const cors = require('cors'); // Middleware para habilitar CORS
const mongoose = require('mongoose'); // Conexión con MongoDB

// Importación de las rutas específicas para manejar distintas entidades
const studentRoutes = require('./routes/RouteStudent');
const taskRoutes = require('./routes/RouteTask');
const studentTaskRoutes = require('./routes/RouteStudentTask');
const adminRoutes = require('./routes/RouteAdmin');
const teacherRoutes = require('./routes/RouteTeacher');
const materialsRoutes = require('./routes/RouteMaterials');
const materialsRequestRoutes = require('./routes/RouteMaterialsRequest')

// Creación de la aplicación Express
const app = express();
const PORT = 3000; // Puerto en el que escuchará el servidor

// URI de conexión a la base de datos MongoDB
const MONGO_URI = 'mongodb://mongoadmin:admin@mongo-db:27017';

// Middleware para analizar el cuerpo de las solicitudes con un límite mayor (Para poder añadir la tarea)
app.use(express.json({ limit: '10mb' })); // Aumenta el límite a 10 MB

// Configuración de Mongoose para deshabilitar ciertas advertencias de consulta
mongoose.set('strictQuery', true);

// Conexión a la base de datos MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware para habilitar CORS y analizar JSON en las solicitudes
app.use(cors());
app.use(express.json());

/**
 * Configuración de rutas específicas.
 * Cada ruta importa controladores que manejan la lógica para los endpoints relacionados.
 */
app.use('/api/students', studentRoutes); // Rutas relacionadas con estudiantes
app.use('/api/tasks', taskRoutes); // Rutas relacionadas con tareas
app.use('/api/student-tasks', studentTaskRoutes); // Rutas relacionadas con la asignación de tareas a estudiantes
app.use('/api/teachers', teacherRoutes); // Rutas relacionadas con profesores
app.use('/api/admin', adminRoutes); // Rutas relacionadas con administradores
app.use('/api/materials', materialsRoutes);
app.use('/api/materials-request', materialsRequestRoutes);

/**
 * Endpoint principal para verificar la disponibilidad de la API.
 */
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend API!', usingAPI: true });
});

/**
 * Inicio del servidor en el puerto especificado.
 */
app.listen(PORT, () => {
    console.log('Server running on https://api.jsdu9873.tech/api/');
});
