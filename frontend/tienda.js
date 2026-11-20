// =====================================================================
// tienda.js · El escaparate para el cliente.
// Usa la MISMA API que el panel de gestión, pero solo para LEER (GET).
// El cliente puede buscar y filtrar; no puede crear, editar ni borrar.
// =====================================================================

// Dirección de la API: viene de config.js (local: puerto 3000; Render: URL pública)
const API = `${window.API_URL || 'http://localhost:3000'}/productos`;

// Nombre e icono de cada categoría (sustituyen a las fotos)
const CATEGORIAS = {
  portatil: { nombre: 'Portátil', icono: '💻' },
  sobremesa: { nombre: 'Sobremesa', icono: '🖥️' },
  movil: { nombre: 'Móvil', icono: '📱' },
  tablet: { nombre: 'Tablet', icono: '📱' },
  monitor: { nombre: 'Monitor', icono: '🖥️' },
  periferico: { nombre: 'Periférico', icono: '🖱️' },
  audio: { nombre: 'Audio', icono: '🎧' },
  otro: { nombre: 'Otro', icono: '📦' },
};

// ---- Referencias a elementos de la página ----
const rejilla = document.getElementById('rejilla');
const resumen = document.getElementById('resumen');
const mensaje = document.getElementById('mensaje');
const buscar = document.getElementById('buscar');
const filtroCategoria = document.getElementById('filtro-categoria');
const orden = document.getElementById('orden');

const formatoEuros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// Todos los productos recibidos del servidor (los filtros trabajan sobre esta copia)
let productos = [];

// ---- Pedir los productos a la API (GET /productos) ----
async function cargarProductos() {
  // El servidor gratuito de Render "se duerme" y tarda ~1 minuto en despertar
  resumen.textContent = 'Cargando productos… (si el servidor estaba dormido, puede tardar hasta 1 minuto)';
  try {
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
    productos = await respuesta.json();
    mensaje.hidden = true;
    pintar();
  } catch {
    resumen.textContent = '';
    rejilla.innerHTML = '';
    mensaje.textContent = 'La tienda no está disponible ahora mismo. ¿Están encendidos el backend y MongoDB?';
    mensaje.className = 'mensaje mensaje-error';
    mensaje.hidden = false;
  }
}

// ---- Aplicar búsqueda, filtro y orden (solo cambia lo que se ve) ----
function productosVisibles() {
  const texto = buscar.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;

  let lista = productos.filter((p) => {
    const coincideTexto = !texto || `${p.nombre} ${p.marca} ${p.descripcion}`.toLowerCase().includes(texto);
    const coincideCategoria = !categoria || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  if (orden.value === 'precio-asc') lista.sort((a, b) => a.precio - b.precio);
  else if (orden.value === 'precio-desc') lista.sort((a, b) => b.precio - a.precio);
  else if (orden.value === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.reverse(); // novedades: los últimos añadidos primero

  return lista;
}

// ---- Pintar la rejilla de tarjetas ----
function pintar() {
  const lista = productosVisibles();
  resumen.textContent = `${lista.length} de ${productos.length} productos`;
  rejilla.innerHTML = '';

  if (lista.length === 0) {
    const vacio = document.createElement('p');
    vacio.className = 'sin-resultados';
    vacio.textContent = 'No hay productos que coincidan con la búsqueda.';
    rejilla.append(vacio);
    return;
  }

  for (const p of lista) rejilla.append(tarjeta(p));
}

// Crea la tarjeta de un producto (textContent evita que se cuele HTML de los datos)
function tarjeta(p) {
  const cat = CATEGORIAS[p.categoria] || CATEGORIAS.otro;
  const art = document.createElement('article');
  art.className = 'producto' + (p.stock === 0 ? ' agotado' : '');

  // "Foto": icono de la categoría + etiqueta
  const foto = document.createElement('div');
  foto.className = 'foto cat-' + p.categoria;
  foto.textContent = cat.icono;
  const etiquetaCat = document.createElement('span');
  etiquetaCat.className = 'etiqueta etiqueta-' + p.categoria;
  etiquetaCat.textContent = cat.nombre;
  foto.append(etiquetaCat);

  // Información del producto
  const info = document.createElement('div');
  info.className = 'info';
  const marca = elemento('span', 'marca', p.marca);
  const nombre = elemento('h3', '', p.nombre);
  info.append(marca, nombre);
  if (p.descripcion) info.append(elemento('p', 'descripcion', p.descripcion));

  // Pie: precio y disponibilidad
  const pie = document.createElement('div');
  pie.className = 'pie';
  const precio = elemento('span', 'precio', formatoEuros.format(p.precio));
  let disponibilidad;
  if (p.stock === 0) disponibilidad = elemento('span', 'etiqueta stock-agotado', 'Agotado');
  else if (p.stock < 5) disponibilidad = elemento('span', 'etiqueta stock-bajo', `¡Últimas ${p.stock}!`);
  else disponibilidad = elemento('span', 'etiqueta stock-ok', 'En stock');
  pie.append(precio, disponibilidad);
  info.append(pie);

  art.append(foto, info);
  return art;
}

function elemento(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  el.textContent = texto;
  return el;
}

// ---- Los filtros vuelven a pintar al cambiar ----
buscar.addEventListener('input', pintar);
filtroCategoria.addEventListener('change', pintar);
orden.addEventListener('change', pintar);

// ---- Arranque ----
cargarProductos();
