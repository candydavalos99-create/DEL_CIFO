# Catálogo de productos tecnológicos

Proyecto de aprendizaje: una web con un formulario y un listado de productos tecnológicos (crear, listar, editar y borrar), construida en tres fases: frontend → + backend (NestJS) → + base de datos (MongoDB).

## Arquitectura final

```
┌──────────────────────┐   HTTP + JSON    ┌──────────────────────┐   Mongoose   ┌──────────────────────┐
│  Navegador           │ ───────────────▶ │  API NestJS          │ ───────────▶ │  MongoDB             │
│  frontend/ · :8080   │ ◀─────────────── │  backend/ · :3000    │ ◀─────────── │  BD: catalogo        │
└──────────────────────┘                  └──────────────────────┘              │  :27017              │
                                                                                └──────────────────────┘
```

## Cómo arrancarlo

Hacen falta **tres terminales**, una por pieza, y hay que arrancarlas **en este orden**: primero el almacén (MongoDB), después la trastienda (backend) y por último el escaparate (frontend).

**1. MongoDB (puerto 27017)**

MongoDB 9.0.8 está instalado en la carpeta del usuario `~/mongodb`, porque Homebrew no tiene permisos en el ordenador del aula. Los datos se guardan en `~/mongodb/data`.

```bash
~/mongodb/bin/mongod --dbpath ~/mongodb/data --bind_ip 127.0.0.1 --port 27017
```

Para ver los datos directamente en la base de datos:

```bash
npx mongosh@2.14.1 "mongodb://127.0.0.1:27017/catalogo"
# dentro de mongosh:
db.productos.find()
```

**2. Backend (API NestJS, puerto 3000)**

La primera vez, instala las dependencias:

```bash
cd backend
npm install
```

Para arrancarlo:

```bash
cd backend
npm run start:dev
```

Comprobar: http://localhost:3000/productos debe mostrar los productos en JSON. Si la colección está vacía, el backend inserta 3 productos de ejemplo al arrancar.

**3. Frontend (puerto 8080)**

```bash
cd frontend
python3 -m http.server 8080
```

Abrir http://localhost:8080 en el navegador. Para parar cualquiera de las tres piezas: `Ctrl + C` en su terminal.

## API REST

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/productos` | Lista todos los productos |
| GET | `/productos/:id` | Devuelve un producto |
| POST | `/productos` | Crea un producto |
| PATCH | `/productos/:id` | Modifica un producto |
| DELETE | `/productos/:id` | Borra un producto |

Ejemplo:

```bash
curl -X POST http://localhost:3000/productos -H "Content-Type: application/json" \
  -d '{"nombre":"iPhone 16","marca":"Apple","categoria":"movil","precio":959,"stock":3}'
```

Errores: `400` si los datos no son válidos (con la lista de motivos) y `404` si el producto no existe.

## Recorrido de una petición (ejemplo: guardar un producto)

1. **Navegador:** rellenas el formulario y pulsas *Guardar*. `app.js` hace `fetch` → `POST http://localhost:3000/productos` con el producto en JSON.
2. **CORS:** el navegador comprueba que el backend autoriza al origen `http://localhost:8080`. Lo autoriza, así que la petición sigue.
3. **NestJS · `ValidationPipe`:** convierte el JSON en un `CreateProductoDto` y comprueba las reglas. Si algo falla, responde `400` y la petición termina aquí.
4. **Controlador** (`productos.controller.ts`): la ruta `POST /productos` llama a `productosService.create(...)`.
5. **Servicio** (`productos.service.ts`): le pide al modelo de Mongoose que cree el documento.
6. **Mongoose:** valida con el esquema `Producto`, añade `createdAt` y `updatedAt` y lo envía a **MongoDB**.
7. **MongoDB:** lo guarda en la colección `productos` de la base de datos `catalogo` y le asigna un `_id`.
8. **Vuelta:** Mongoose devuelve el documento → el servicio → el controlador → NestJS responde `201` con el JSON (y `id` en lugar de `_id`).
9. **Navegador:** `app.js` muestra el aviso verde y vuelve a pedir la lista (`GET /productos`) para pintarla.

## Limitaciones por fase

- **Fase 1** (solo frontend): los datos vivían en el navegador y se perdían al recargar la página.
- **Fase 2** (+ backend): los datos vivían en la memoria del servidor y se perdían al reiniciarlo.
- **Fase 3** (+ MongoDB): los datos se guardan en disco y **se mantienen** aunque se reinicie todo.
