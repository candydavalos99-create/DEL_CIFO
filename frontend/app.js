// =====================================================================
// app.js · Fase 2: el "comportamiento" de la página.
// Los productos ya NO viven en el navegador: se piden a la API (backend NestJS)
// con fetch. El navegador solo muestra lo que el servidor le devuelve.
// =====================================================================

// ---- Dirección de la API (el backend escucha en el puerto 3000) ----
const API = 'http://localhost:3000/productos';

// Copia local de lo último que nos ha enviado el servidor (solo para pintar)
let productos = [];

// Categorías válidas y su nombre para mostrar
const CATEGORIAS = {
  portatil: 'Portátil', sobremesa: 'Sobremesa', movil: 'Móvil', tablet: 'Tablet',
  monitor: 'Monitor', periferico: 'Periférico', audio: 'Audio', otro: 'Otro',
};

// ---- Referencias a elementos de la página ----
const form = document.getElementById('form-producto');
const lista = document.getElementById('lista-productos');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');

const formatoEuros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// ---- Comunicación con la API ----
// Hace una petición HTTP y devuelve el JSON de la respuesta.
// Si el servidor responde con error (400, 404...), lanza un error con su mensaje.
async function pedir(url, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, {
      ...opciones,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    throw new Error('No se puede conectar con el servidor. ¿Está arrancado el backend en el puerto 3000? ¿Permite CORS desde esta web? (Mira la consola del navegador).');
  }
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    const texto = Array.isArray(datos.message) ? datos.message.join('. ') : datos.message;
    throw new Error(texto || `Error ${respuesta.status}`);
  }
  return datos;
}

// GET /productos → recarga la lista desde el servidor y la pinta
async function cargarProductos() {
  try {
    productos = await pedir(API);
    pintarLista();
  } catch (error) {
    lista.innerHTML = '';
    mostrarMensaje(error.message, 'error');
  }
}

// ---- Pintar el listado: convierte el array en filas de la tabla ----
function pintarLista() {
  contador.textContent = productos.length;
  lista.innerHTML = '';

  if (productos.length === 0) {
    lista.innerHTML = '<tr><td colspan="6" class="vacio">Todavía no hay productos.</td></tr>';
    return;
  }

  for (const p of productos) {
    const fila = document.createElement('tr');

    // Nombre (y descripción debajo, si la hay)
    const celdaNombre = document.createElement('td');
    const nombre = document.createElement('strong');
    nombre.textContent = p.nombre;
    celdaNombre.append(nombre);
    if (p.descripcion) {
      const desc = document.createElement('small');
      desc.textContent = p.descripcion;
      celdaNombre.append(desc);
    }

    const celdaMarca = celda(p.marca);
    const celdaCategoria = celda(CATEGORIAS[p.categoria], 'etiqueta etiqueta-' + p.categoria);
    const celdaPrecio = celda(formatoEuros.format(p.precio), 'numero');

    // Stock con color según disponibilidad
    let claseStock = 'stock-ok';
    if (p.stock === 0) claseStock = 'stock-agotado';
    else if (p.stock < 5) claseStock = 'stock-bajo';
    const celdaStock = celda(p.stock === 0 ? 'Agotado' : p.stock, 'etiqueta ' + claseStock);

    // Acciones: botones de editar y borrar (guardan el id del producto)
    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'botones-fila';
    celdaAcciones.append(boton('Editar', 'editar', p.id), boton('Borrar', 'borrar', p.id));

    fila.append(celdaNombre, celdaMarca, celdaCategoria, celdaPrecio, celdaStock, celdaAcciones);
    lista.append(fila);
  }
}

// Crea una celda con texto (textContent evita que se cuele HTML de los datos)
function celda(texto, clase) {
  const td = document.createElement('td');
  if (clase && clase.startsWith('etiqueta')) {
    const span = document.createElement('span');
    span.className = clase;
    span.textContent = texto;
    td.append(span);
  } else {
    if (clase) td.className = clase;
    td.textContent = texto;
  }
  return td;
}

// Crea un botón pequeño de acción para una fila
function boton(texto, accion, id) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = 'mini ' + accion;
  b.dataset.accion = accion;
  b.dataset.id = id;
  return b;
}

// ---- Validación rápida en el navegador (el servidor vuelve a comprobarlo todo) ----
function validar(p) {
  const errores = [];
  if (p.nombre.length < 2 || p.nombre.length > 100) errores.push('El nombre debe tener entre 2 y 100 caracteres.');
  if (!p.marca) errores.push('La marca es obligatoria.');
  if (!CATEGORIAS[p.categoria]) errores.push('Elige una categoría válida.');
  if (Number.isNaN(p.precio) || p.precio < 0) errores.push('El precio debe ser un número mayor o igual que 0.');
  if (!Number.isInteger(p.stock) || p.stock < 0) errores.push('El stock debe ser un número entero mayor o igual que 0.');
  if (p.descripcion.length > 500) errores.push('La descripción no puede superar 500 caracteres.');
  return errores;
}

// ---- Avisos al usuario ----
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'mensaje mensaje-' + tipo;
  mensaje.hidden = false;
}

// ---- Modo edición: recuerda qué producto se está editando (null = creando uno nuevo) ----
let editandoId = null;
const tituloForm = document.getElementById('titulo-form');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

function entrarEnEdicion(p) {
  editandoId = p.id;
  form.nombre.value = p.nombre;
  form.marca.value = p.marca;
  form.categoria.value = p.categoria;
  form.precio.value = p.precio;
  form.stock.value = p.stock;
  form.descripcion.value = p.descripcion;
  tituloForm.textContent = 'Editar producto';
  btnGuardar.textContent = 'Guardar cambios';
  btnCancelar.textContent = 'Cancelar';
  mensaje.hidden = true;
  form.scrollIntoView({ behavior: 'smooth' });
}

function salirDeEdicion() {
  editandoId = null;
  tituloForm.textContent = 'Nuevo producto';
  btnGuardar.textContent = 'Guardar';
  btnCancelar.textContent = 'Limpiar';
}

// ---- Clics en Editar / Borrar de la tabla ----
lista.addEventListener('click', async (evento) => {
  const b = evento.target.closest('button[data-accion]');
  if (!b) return;
  const producto = productos.find((p) => p.id === b.dataset.id);
  if (!producto) return;

  if (b.dataset.accion === 'editar') {
    entrarEnEdicion(producto);
  } else if (b.dataset.accion === 'borrar') {
    if (!confirm(`¿Borrar "${producto.nombre}"?`)) return;
    try {
      // DELETE /productos/:id → el servidor lo borra de su array
      await pedir(`${API}/${producto.id}`, { method: 'DELETE' });
      if (editandoId === producto.id) form.reset();
      await cargarProductos();
      mostrarMensaje(`"${producto.nombre}" se ha borrado.`, 'ok');
    } catch (error) {
      mostrarMensaje(error.message, 'error');
    }
  }
});

// ---- Guardar: crea (POST) o modifica (PATCH) un producto en el servidor ----
form.addEventListener('submit', async (evento) => {
  // Evita que el navegador recargue la página (el comportamiento clásico de un formulario)
  evento.preventDefault();

  // Leemos los campos y los convertimos al tipo correcto
  const datos = new FormData(form);
  const stockTexto = datos.get('stock').trim();
  const producto = {
    nombre: datos.get('nombre').trim(),
    marca: datos.get('marca').trim(),
    categoria: datos.get('categoria'),
    precio: parseFloat(datos.get('precio')),
    stock: stockTexto === '' ? 0 : Number(stockTexto),
    descripcion: datos.get('descripcion').trim(),
  };

  const errores = validar(producto);
  if (errores.length > 0) {
    mostrarMensaje(errores.join(' '), 'error');
    return;
  }

  try {
    if (editandoId) {
      // PATCH /productos/:id → el servidor modifica el producto
      await pedir(`${API}/${editandoId}`, { method: 'PATCH', body: JSON.stringify(producto) });
    } else {
      // POST /productos → el servidor crea el producto y le asigna un id
      await pedir(API, { method: 'POST', body: JSON.stringify(producto) });
    }
    form.reset();
    await cargarProductos();
    mostrarMensaje(`"${producto.nombre}" se ha guardado correctamente.`, 'ok');
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  }
});

// Al limpiar o cancelar, volvemos al modo "nuevo producto"
form.addEventListener('reset', () => { salirDeEdicion(); });

// ---- Arranque: pedimos la lista al servidor ----
cargarProductos();
