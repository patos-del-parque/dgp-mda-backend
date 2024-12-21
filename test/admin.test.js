const request = require('supertest');
const app = require('../app'); // Asegúrate de que tu aplicación Express se exporte correctamente
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// Conexión a la base de datos de pruebas antes de que inicien los tests
beforeAll(async () => {
  const mongoURI = 'mongodb://localhost:27017/test_db'; // Usa una base de datos de pruebas
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Limpiar la base de datos después de cada test
afterEach(async () => {
  await Admin.deleteMany();
});

// Cerrar la conexión de la base de datos después de que terminen los tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test para agregar un administrador
describe('POST /api/admin/add', () => {
  it('debe crear un nuevo administrador', async () => {
    const adminData = { nombre: 'Pedro', password: '1234' };
    const response = await request(app).post('/api/admin/add').send(adminData);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Administrador registrado con éxito');
    expect(response.body.admin).toHaveProperty('nombre', 'Pedro');
  });

  it('debe devolver error si faltan campos', async () => {
    const response = await request(app).post('/api/admin/add').send({ nombre: 'Carlos' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Error al registrar el admin');
  });
});

// Test para obtener todos los administradores
describe('GET /api/admin/get', () => {
  it('debe devolver todos los administradores', async () => {
    await Admin.create({ nombre: 'Pedro', password: '1234' });
    const response = await request(app).get('/api/admin/get');

    expect(response.status).toBe(200);
    expect(response.body.admins).toHaveLength(1);
    expect(response.body.admins[0]).toHaveProperty('nombre', 'Pedro');
  });
});

// Test para obtener un administrador por nombre
describe('GET /api/admin/get/:name', () => {
  it('debe devolver un administrador por nombre', async () => {
    const admin = await Admin.create({ nombre: 'Pedro', password: '1234' });

    const response = await request(app).get(`/api/admin/get/${admin.nombre}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('nombre', 'Pedro');
  });

  it('debe devolver un error si el administrador no existe', async () => {
    const response = await request(app).get('/api/admin/get/NoExistente');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Admin not found');
  });
});

// Test para actualizar un administrador
describe('PUT /api/admin/update/:name', () => {
  it('debe actualizar los datos de un administrador', async () => {
    const admin = await Admin.create({ nombre: 'Pedro', password: '1234' });

    const updatedData = { password: '5678' };
    const response = await request(app).put(`/api/admin/update/${admin.nombre}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('password', '5678');
  });

  it('debe devolver error si el administrador no existe', async () => {
    const updatedData = { password: '5678' };
    const response = await request(app).put('/api/admin/update/NoExistente').send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Admin not found');
  });
});

// Test para eliminar un administrador
describe('DELETE /api/admin/delete/:name', () => {
  it('debe eliminar un administrador', async () => {
    const admin = await Admin.create({ nombre: 'Pedro', password: '1234' });

    const response = await request(app).delete(`/api/admin/delete/${admin.nombre}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Admin borrado correctamente');
  });

  it('debe devolver error si el administrador no existe', async () => {
    const response = await request(app).delete('/api/admin/delete/NoExistente');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Admin no encontrado');
  });
});

// Test para el login
describe('POST /api/admin/login', () => {
  it('debe hacer login correctamente con credenciales válidas', async () => {
    await Admin.create({ nombre: 'Pedro', password: '1234' });

    const response = await request(app).post('/api/admin/login').send({ nombre: 'Pedro', password: '1234' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login exitoso');
  });

  it('debe devolver error si las credenciales son incorrectas', async () => {
    await Admin.create({ nombre: 'Pedro', password: '1234' });

    const response = await request(app).post('/api/admin/login').send({ nombre: 'Pedro', password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Credenciales incorrectas');
  });

  it('debe devolver error si el admin no existe', async () => {
    const response = await request(app).post('/api/admin/login').send({ nombre: 'NoExistente', password: '1234' });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Admin no encontrado');
  });
});
