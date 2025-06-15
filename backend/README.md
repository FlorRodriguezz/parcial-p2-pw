# 🛒 E-Commerce API

API REST para la gestión de un sistema de e-commerce. Permite administrar **usuarios, productos y pedidos**, con control de acceso por roles y autenticación segura con JWT.

---

## 📦 Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt para hashing de contraseñas
- Mocha + Chai para testing
- Dotenv para variables de entorno

---

## 📁 Estructura del proyecto

parcialP2/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── test/
├── config/
├── node_modules/
├── public/ # Frontend HTML básico
├── package-lock.json
├── package.json
├── server.js
├── app.js
├── .env
└── README.md

---

## 🔐 Autenticación y Roles

- **Registro** y **login** de usuarios
- Contraseñas hasheadas con `bcrypt`
- JWT para proteger rutas
- Roles: `admin` y `cliente`
- Middleware para control de acceso por rol

---

## 🧪 Testing
Se incluyen pruebas con Mocha y Chai:
test/usuario.test.js: registro de usuarios
test/login.test.js: login con casos válidos e inválidos

---

## 📺 Demo del proyecto
📹 Link al video (agregalo cuando lo tengas):
https://...

---

## 🌐 Endpoints principales

### 🧑‍💼 Usuarios

| Método | Ruta                    | Rol requerido | Descripción                |
|--------|-------------------------|---------------|----------------------------|
| POST   | `/api/usuarios/registro`| Público       | Registrar nuevo usuario    |
| POST   | `/api/usuarios/login`   | Público       | Login y obtener token      |

### 📦 Productos

| Método | Ruta                        | Rol requerido | Descripción         |
|--------|-----------------------------|---------------|---------------------|
| GET    | `/api/productos`            | Público       | Listar productos    |
| POST   | `/api/productos`            | Admin         | Crear producto      |
| PUT    | `/api/productos/:id`        | Admin         | Editar producto     |
| DELETE | `/api/productos/:id`        | Admin         | Eliminar producto   |

### 🛒 Pedidos

| Método | Ruta                          | Rol requerido | Descripción                |
|--------|-------------------------------|---------------|----------------------------|
| POST   | `/api/pedidos`                | Cliente       | Crear nuevo pedido         |
| GET    | `/api/pedidos/mios`           | Cliente       | Ver pedidos propios        |
| GET    | `/api/pedidos`                | Admin         | Ver todos los pedidos      |
| PUT    | `/api/pedidos/:id`            | Admin         | Actualizar estado del pedido |

---

## 👩‍💻 Autor

**Florencia Rodríguez**  
Desarrolladora Backend - Proyecto para Parcial P2