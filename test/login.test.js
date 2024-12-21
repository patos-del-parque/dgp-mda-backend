// tests/login.test.js
const request = require('supertest');
const app = require('../app'); // Importa tu archivo Express

describe('POST /api/login', () => {
  it('debería devolver un mensaje de éxito cuando el email y la contraseña sean correctos', (done) => {
    const credentials = {
      email: 'pedro@example.com',
      password: '123',
    };

    request(app)
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect((res) => {
        if (res.body.success !== true || res.body.role !== 'admin') {
          throw new Error('El login no fue exitoso');
        }
      })
      .end(done);
  });

  it('debería devolver un error 401 cuando el email o la contraseña sean incorrectos', (done) => {
    const credentials = {
      email: 'pedro@example.com',
      password: 'incorrectPassword',
    };

    request(app)
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect((res) => {
        if (res.body.success !== false || res.body.message !== 'Correo o contraseña incorrectos') {
          throw new Error('No se generó el error esperado');
        }
      })
      .end(done);
  });
});
