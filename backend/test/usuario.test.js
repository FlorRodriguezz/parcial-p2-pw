const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app'); 

describe('Pruebas básicas de Usuarios', () => {

  it('POST /api/usuarios/registro - registro exitoso', async () => {
     const email = `testuser${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/usuarios/registro')
      .send({
        nombre: 'TestUser',
        email,
        password: '123456',
        rol: 'cliente'
      });
console.log('Respuesta del backend:', res.body);
console.log('>>> Status code:', res.status);

  expect(res.status).to.equal(201);
  expect(res.body).to.have.property('usuario');
  expect(res.body.usuario).to.have.property('email', email);

  });

  it('POST /api/usuarios/registro - falla por datos inválidos', async () => {
    const res = await request(app)
      .post('/api/usuarios/registro')
      .send({
        nombre: '',
        email: 'no-es-email',
        password: '123',
        rol: 'otro'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('errores').that.is.an('array');
  });

});
