// =====================================================================
// app.js · Fase 1: el "comportamiento" de la página.
// Los productos viven en un array en la memoria del navegador.
// Si recargas la página, el array vuelve a su estado inicial.
// =====================================================================

// ---- Datos: el inventario de la tienda (array en memoria) ----
let productos = [
  { id: '1', nombre: 'MacBook Air 13"', marca: 'Apple', categoria: 'portatil', precio: 1199, stock: 5, descripcion: 'Portátil ligero con chip M3.' },
  { id: '2', nombre: 'MX Master 3S', marca: 'Logitech', categoria: 'periferico', precio: 109.99, stock: 12, descripcion: 'Ratón ergonómico inalámbrico.' },
  { id: '3', nombre: 'ThinkVision P27h', marca: 'Lenovo', categoria: 'monitor', precio: 349, stock: 0, descripcion: '' },
];

// En la fase 1 el id lo generamos "a mano" con un contador
let siguienteId = 4;

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

    // Acciones (editar y borrar llegarán en el siguiente paso)
    const celdaAcciones = celda('—', 'pendiente');

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

// ---- Validación: aplica las reglas del modelo Producto ----
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

// ---- Guardar: al enviar el formulario se crea un producto en el array ----
form.addEventListener('submit', (evento) => {
  // Evita que el navegador recargue la página (el comportamiento clásico de un formulario)
  evento.preventDefault();

  // Leemos los campos y los convertimos al tipo correcto
  const datos = new FormData(form);
  const stockTexto = datos.get('stock').trim();
  const nuevo = {
    id: String(siguienteId),
    nombre: datos.get('nombre').trim(),
    marca: datos.get('marca').trim(),
    categoria: datos.get('categoria'),
    precio: parseFloat(datos.get('precio')),
    stock: stockTexto === '' ? 0 : Number(stockTexto),
    descripcion: datos.get('descripcion').trim(),
  };

  const errores = validar(nuevo);
  if (errores.length > 0) {
    mostrarMensaje(errores.join(' '), 'error');
    return;
  }

  productos.push(nuevo);
  siguienteId++;
  pintarLista();
  form.reset();
  mostrarMensaje(`"${nuevo.nombre}" se ha guardado correctamente.`, 'ok');
});

// Al limpiar el formulario, ocultamos el aviso
form.addEventListener('reset', () => { mensaje.hidden = true; });

// ---- Arranque: pintamos el listado inicial ----
pintarLista();
