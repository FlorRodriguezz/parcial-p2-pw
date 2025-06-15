const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app'); 

describe('Pruebas de Login de Usuario', () => {

  it('POST /api/usuarios/login - login exitoso', async () => {
    
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'testuser@example.com',  
        password: '123456'               
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('token').that.is.a('string');
    expect(res.body).to.have.property('usuario');
    expect(res.body.usuario).to.have.property('email', 'testuser@example.com');
  });

  it('POST /api/usuarios/login - falla por email incorrecto', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'noexiste@example.com',
        password: '123456'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property('error').that.includes('incorrectos');
  });

  it('POST /api/usuarios/login - falla por contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'testuser@example.com',  
        password: 'wrongpassword'
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property('error').that.includes('incorrectos');
  });

});
