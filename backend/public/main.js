// Construye headers para fetch, agregando token si existe
const headers = () => {
  const token = localStorage.getItem('token');
  return { 
    'Content-Type': 'application/json', 
    ...(token && { Authorization: 'Bearer ' + token }) 
  };
};

// Cierra sesión: elimina token y usuario, recarga página
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  location.reload();
}

// Inicializa la interfaz según si hay sesión activa y rol del usuario
function init() {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const isLogged = token && usuario.nombre;

  // Mostrar/ocultar bloques principales
  document.getElementById('registroLogin').style.display = isLogged ? 'none' : 'block';
  document.getElementById('contenidoPrivado').style.display = isLogged ? 'block' : 'none';
  document.getElementById('usuarioInfo').style.display = isLogged ? 'block' : 'none';

  if (!isLogged) return;

  // Mostrar nombre, rol y botón logout
  document.getElementById('usuarioNombre').textContent = usuario.nombre;
  document.getElementById('usuarioRol').textContent = usuario.rol;
  document.getElementById('logoutBtn').style.display = 'block';

  // Mostrar secciones según rol
  if (usuario.rol === 'admin') {
    document.getElementById('seccionAgregarProducto').style.display = 'block';
    document.getElementById('seccionPedidos').style.display = 'block';
    document.getElementById('pedidoForm').style.display = 'none';
    document.getElementById('misPedidosSection').style.display = 'none';
    document.getElementById('todosPedidosSection').style.display = 'block';
    document.getElementById('actualizarEstadoSection').style.display = 'block';
  } else if (usuario.rol === 'cliente') {
    document.getElementById('seccionAgregarProducto').style.display = 'none';
    document.getElementById('seccionPedidos').style.display = 'block';
    document.getElementById('pedidoForm').style.display = 'block';
    document.getElementById('misPedidosSection').style.display = 'block';
    document.getElementById('todosPedidosSection').style.display = 'none';
    document.getElementById('actualizarEstadoSection').style.display = 'none';
    cargarSelectorProductos();
  }
}

// Registra un usuario, validando campos y mostrando mensajes
async function registrar() {
  const reg = {
    nombre: document.getElementById('regNombre').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    password: document.getElementById('regPassword').value.trim(),
    rol: document.getElementById('regRol').value
  };
  const msg = document.getElementById('regMensaje');

  if (!reg.nombre || !reg.email || !reg.password || !reg.rol) {
    msg.textContent = 'Completa todos los campos';
    return;
  }

  try {
    const res = await fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(reg)
    });
    const data = await res.json();
    msg.textContent = res.ok ? 'Usuario registrado' : data.error || JSON.stringify(data);
  } catch {
    msg.textContent = 'Error de conexión';
  }
}

// Login: envía email y password, guarda token y usuario localmente
async function login() {
  const loginData = {
    email: document.getElementById('loginEmail').value.trim(),
    password: document.getElementById('loginPassword').value.trim()
  };
  const msg = document.getElementById('loginMensaje');

  if (!loginData.email || !loginData.password) {
    msg.textContent = 'Email y contraseña son obligatorios';
    return;
  }

  try {
    const res = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(loginData)
    });
    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      msg.textContent = 'Login exitoso';
      init();
    } else {
      msg.textContent = data.error || 'Error en login';
    }
  } catch {
    msg.textContent = 'Error de conexión';
  }
}

// Lista todos los productos y muestra botones según rol
async function listarProductos() {
  const lista = document.getElementById('listaProductos');
  lista.textContent = 'Cargando...';

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  try {
    const res = await fetch('/api/productos', { headers: headers() });
    const data = await res.json();

    if (!res.ok) {
      lista.textContent = data.error || 'Error al cargar productos';
      return;
    }

    lista.textContent = '';

    data.data.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.nombre}</strong> - $${p.precio} - Stock: ${p.stock} <br>
        ${p.descripcion ? `<em>${p.descripcion}</em><br>` : ''}
        ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" style="max-width:100px; display:block; margin-top:5px;">` : ''}
      `;

      // Si es admin, agrega botones de editar y eliminar
      if (usuario.rol === 'admin') {
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => mostrarEditarProducto(p);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarProducto(p._id);

        li.append(' ', btnEditar, ' ', btnEliminar);
      }

      lista.appendChild(li);
    });

  } catch {
    lista.textContent = 'Error de conexión';
  }
}

// Muestra formulario de edición con datos del producto seleccionado
function mostrarEditarProducto(producto) {
  document.getElementById('seccionEditarProducto').style.display = 'block';

  document.getElementById('editarId').value = producto._id;
  document.getElementById('editarNombre').value = producto.nombre;
  document.getElementById('editarDescripcion').value = producto.descripcion || '';
  document.getElementById('editarPrecio').value = producto.precio;
  document.getElementById('editarStock').value = producto.stock;
  document.getElementById('editarImagen').value = producto.imagen || '';
  document.getElementById('editarProductoResultado').textContent = '';
}

// Edita un producto vía API, muestra alertas según resultado y recarga lista
async function editarProducto(id, datos) {
  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(datos)
    });
    const data = await res.json();

    if (res.ok) {
      alert('Producto editado correctamente');
      listarProductos();
    } else {
      alert(data.error || 'Error al editar producto');
    }
  } catch {
    alert('Error de conexión al editar producto');
  }
}

// Elimina producto tras confirmar, recarga lista tras éxito o muestra error
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    const data = await res.json();

    if (res.ok) {
      alert('Producto eliminado correctamente');
      listarProductos();
    } else {
      alert(data.error || 'Error al eliminar producto');
    }
  } catch {
    alert('Error de conexión al eliminar producto');
  }
}

// Guarda los cambios realizados en el formulario de edición del producto
async function guardarEdicionProducto() {
  const id = document.getElementById('editarId').value;
  const nombre = document.getElementById('editarNombre').value.trim();
  const descripcion = document.getElementById('editarDescripcion').value.trim();
  const precio = Number(document.getElementById('editarPrecio').value);
  const stock = Number(document.getElementById('editarStock').value);
  const imagen = document.getElementById('editarImagen').value.trim();

  if (!nombre || isNaN(precio) || isNaN(stock)) {
    document.getElementById('editarProductoResultado').textContent = 'Datos inválidos';
    return;
  }

  const datos = { nombre, descripcion, precio, stock };
  if (imagen) datos.imagen = imagen;

  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(datos)
    });
    const data = await res.json();

    const mensaje = document.getElementById('editarProductoResultado');
    if (res.ok) {
      mensaje.textContent = 'Producto editado correctamente';
      listarProductos();
      cancelarEdicionProducto();
    } else {
      mensaje.textContent = data.error || 'Error al editar producto';
    }
  } catch {
    document.getElementById('editarProductoResultado').textContent = 'Error de conexión';
  }
}

// Consulta stock de un producto por nombre
async function consultarStock() {
  const nombre = document.getElementById('nombre').value.trim();
  const salida = document.getElementById('stockDisplay');

  if (!nombre) {
    salida.textContent = 'Ingrese un nombre';
    return;
  }

  try {
    const res = await fetch(`/api/productos/stock?nombre=${encodeURIComponent(nombre)}`, {
      headers: headers()
    });
    const data = await res.json();
    salida.textContent = res.ok ? `Stock: ${data.stock}` : data.error || 'No encontrado';
  } catch {
    salida.textContent = 'Error de conexión';
  }
}


// Agregar producto
async function agregarProducto() {
  const nombre = document.getElementById('nuevoNombre').value.trim();
  const descripcion = document.getElementById('descripcionProducto').value.trim();
  const precio = Number(document.getElementById('nuevoPrecio').value);
  const stock = Number(document.getElementById('nuevoStock').value);
  const resElem = document.getElementById('nuevoProductoResultado');
  const imagen = document.getElementById('imagenProducto').value.trim();
  if (!nombre || isNaN(precio) || isNaN(stock)) return resElem.textContent = 'Datos inválidos';

  try {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ nombre, descripcion, precio, stock, imagen })
    });
    const data = await res.json();
    resElem.textContent = res.ok ? 'Producto agregado' : data.error || 'Error agregar';
    if (res.ok) {
      document.getElementById('nuevoNombre').value = '';
      document.getElementById('descripcionProducto').value = '';
      document.getElementById('nuevoPrecio').value = '';
      document.getElementById('nuevoStock').value = '';
      document.getElementById('imagenProducto').value = '';
      listarProductos();
    }
  } catch {
    resElem.textContent = 'Error conexión';
  }
}

// Editar producto (PUT)
async function editarProducto(id, datos) {
  try {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Producto actualizado correctamente');
      listarProductos(); 
    } else {
      alert(data.error || 'Error al actualizar producto');
    }
  } catch {
    alert('Error conexión al editar producto');
  }
}

// Carrito y pedidos
const carrito = [];

async function cargarSelectorProductos() {
  const select = document.getElementById('selectProducto');
  select.innerHTML = '';
  try {
    const res = await fetch('/api/productos', { headers: headers() });
    const data = await res.json();
    if (!res.ok) 
      return select.innerHTML = `<option>${data.error || 'Error al cargar productos'}</option>`;

    data.data.forEach(prod => {
      const option = document.createElement('option');
      option.value = JSON.stringify({ id: prod._id, nombre: prod.nombre, stock: prod.stock });
      option.textContent = `${prod.nombre} (Stock: ${prod.stock})`;
      select.appendChild(option);
    });
  } catch {
    select.innerHTML = `<option>Error conexión</option>`;
  }
}

function agregarProductoAlCarrito() {
  const select = document.getElementById('selectProducto');
  const inputCantidad = document.getElementById('cantidadProducto');
  const mensaje = document.getElementById('mensajeAgregarProducto');

  const productoSeleccionado = JSON.parse(select.value);
  const cantidad = parseInt(inputCantidad.value);
  mensaje.textContent = '';

  if (isNaN(cantidad) || cantidad <= 0) return mensaje.textContent = 'Cantidad inválida';
  if (cantidad > productoSeleccionado.stock) return mensaje.textContent = `Sólo hay ${productoSeleccionado.stock} disponibles`;

  carrito.push({ producto: productoSeleccionado.id, nombre: productoSeleccionado.nombre, cantidad });
  inputCantidad.value = '';
  actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
  const lista = document.getElementById('carritoLista');
  lista.innerHTML = '';

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - ${item.cantidad} unidad(es)`;

    const btnQuitar = document.createElement('button');
    btnQuitar.textContent = 'Quitar';
    btnQuitar.onclick = () => {
      carrito.splice(index, 1);
      actualizarVistaCarrito();
    };

    li.appendChild(btnQuitar);
    lista.appendChild(li);
  });
}

async function enviarPedidoDesdeCarrito() {
  const msg = document.getElementById('mensajeCrearPedido');
  msg.textContent = '';
  if (carrito.length === 0) return msg.textContent = 'No hay productos en el carrito';

  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ productos: carrito.map(({ producto, cantidad }) => ({ producto, cantidad })) })
    });
    const data = await res.json();
    msg.textContent = res.ok ? '✅ Pedido creado correctamente' : (data.error || 'Error al crear pedido');

    if (res.ok) {
      carrito.length = 0;
      actualizarVistaCarrito();
      cargarSelectorProductos();
    }
  } catch {
    msg.textContent = '❌ Error de conexión';
  }
}

async function verMisPedidos() {
  const pre = document.getElementById('misPedidos');
  pre.textContent = 'Cargando...';

  try {
    const res = await fetch('/api/pedidos/mios', { headers: headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al obtener pedidos');

    if (!Array.isArray(data)) {
      pre.textContent = 'No hay pedidos.';
      return;
    }

    const pedidosTexto = data.map(pedido => {
      const productos = pedido.productos.map(p => 
        `🛒 ${p.producto.nombre} - $${p.producto.precio} x${p.cantidad}`
      ).join('\n');

      return `${productos}\nEstado: ${pedido.estado}\n----------------------`;
    }).join('\n\n');

    pre.textContent = pedidosTexto || 'No hay pedidos aún.';

  } catch (err) {
    console.error(err);
    pre.textContent = 'Error al obtener pedidos.';
  }
}

async function verTodosPedidos() {
  try {
    const res = await fetch('/api/pedidos', {
      headers: headers()
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.msg || 'Error al obtener pedidos');

    const contenedor = document.getElementById('todosPedidos');
    contenedor.innerHTML = ''; 

    if (data.length === 0) {
      contenedor.textContent = 'No hay pedidos aún.';
      return;
    }

    data.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('pedido');
      div.style.border = '1px solid #ccc';
      div.style.padding = '10px';
      div.style.margin = '10px 0';

      const productos = p.productos.map(prod =>
        ` - ${prod.producto.nombre} ($${prod.producto.precio}) x${prod.cantidad}`
      ).join('<br>');

      div.innerHTML = `
        <strong>🆔 Pedido:</strong> ${p._id}<br>
        <strong>👤 Cliente:</strong> ${p.usuario?.nombre || '---'}<br>
        <strong>📦 Productos:</strong><br>${productos}<br>
        <strong>📌 Estado:</strong> ${p.estado}<br><br>

        <label for="estado-${p._id}">Actualizar estado:</label>
        <select id="estado-${p._id}">
          <option value="pendiente" ${p.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="enviado" ${p.estado === 'enviado' ? 'selected' : ''}>Enviado</option>
          <option value="cancelado" ${p.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
        <button onclick="actualizarEstado('${p._id}')">Actualizar</button>
        <p id="mensaje-${p._id}"></p>
      `;

      contenedor.appendChild(div);
    });

  } catch (err) {
    console.error("❌ Error atrapado:", err);
    document.getElementById('todosPedidos').textContent = 'Error al cargar pedidos.';
  }
}

async function actualizarEstado(id) {
  const nuevoEstado = document.getElementById(`estado-${id}`).value;

  try {
    const res = await fetch(`/api/pedidos/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ estado: nuevoEstado })
    });

    const data = await res.json();
    const mensaje = document.getElementById(`mensaje-${id}`);
    mensaje.textContent = res.ok ? '✅ Estado actualizado' : `❌ ${data.msg || 'Error'}`;

  } catch (err) {
    console.error(err);
    document.getElementById(`mensaje-${id}`).textContent = '❌ Error al actualizar pedido';
  }
}

init();
listarProductos();
cargarSelectorProductos();
