# Bitácora del proyecto

Registro de todo lo que hacemos y de las decisiones que tomamos, para no perder el contexto entre sesiones.
Se actualiza al terminar cada paso. Las reglas generales del proyecto están en `CLAUDE.md`.

---

## Estado actual (resumen rápido)

- **Fase:** 3 · Frontend + backend + MongoDB → **terminada**. **Proyecto completo** (fases 1, 2 y 3).
- **Hecho:** CRUD completo con los datos guardados en MongoDB (BD `catalogo`, colección `productos`). Los datos **se mantienen** al reiniciar todo.
- **Validación:** DTOs + `class-validator` (petición) y esquema de Mongoose (base de datos).
- **Git:** commit "fase 3" subido a GitHub.
- **Pendiente de decidir:**
  1. Las skills que instaló Nest en `backend/` (`.claude/`, `.agents/`, `AGENTS.md`): ¿se borran? Por ahora siguen en disco, pero fuera de Git.
  2. La cabecera de la web todavía dice "Fase 2 · ... memoria del servidor". No se ha cambiado para demostrar que el frontend funciona sin tocarlo. ¿Se actualiza el texto?
- **Repositorio en GitHub:** https://github.com/candydavalos99-create/DEL_CIFO (para subir cambios: `git push`)
- **Cómo ver la web:** arrancar las tres piezas (ver abajo) y abrir http://localhost:8080

### Cómo arrancarlo (tres terminales, en este orden)

```bash
# Terminal 1 · MongoDB (puerto 27017, datos en ~/mongodb/data)
~/mongodb/bin/mongod --dbpath ~/mongodb/data --bind_ip 127.0.0.1 --port 27017

# Terminal 2 · backend (API en el puerto 3000)
cd /Users/alumne_mati1/proyectos/actividad01/backend && npm run start:dev

# Terminal 3 · frontend (web en el puerto 8080)
cd /Users/alumne_mati1/proyectos/actividad01/frontend && python3 -m http.server 8080
```
Después, abrir http://localhost:8080 en el navegador. Para parar cada uno: `Ctrl + C` en su terminal.
Si se ve una versión antigua de la página: `Cmd + Shift + R`.
Ver los datos en la base de datos: `npx mongosh@2.14.1 "mongodb://127.0.0.1:27017/catalogo"` y dentro `db.productos.find()`.

### Archivos actuales

| Archivo | Papel |
|---|---|
| `CLAUDE.md` | Reglas, fases y modelo de datos del proyecto |
| `BITACORA.md` | Este registro |
| `README.md` | Cómo arrancar cada pieza, la API y las limitaciones por fase |
| `.gitignore` | Archivos que Git debe ignorar (`.DS_Store`, `node_modules/`, `dist/`, skills de Nest) |
| `frontend/index.html` | Estructura: cabecera, formulario, zona de avisos, tabla del listado |
| `frontend/styles.css` | Aspecto: degradado, tarjetas, etiquetas de color, botones de fila |
| `frontend/app.js` | Comportamiento: pide los datos a la API con `fetch` (GET, POST, PATCH, DELETE) y los pinta |
| `backend/` | Proyecto NestJS generado con Nest CLI 12 |
| `backend/src/main.ts` | Punto de arranque: CORS, validación global (`ValidationPipe`) y puerto 3000 |
| `backend/src/productos/productos.module.ts` | Módulo: agrupa todo lo de productos |
| `backend/src/productos/productos.controller.ts` | Controlador (el "mostrador"): rutas `/productos` |
| `backend/src/productos/productos.service.ts` | Servicio (el "encargado del almacén"): operaciones CRUD contra MongoDB con el modelo de Mongoose; inserta 3 ejemplos si la colección está vacía |
| `backend/src/productos/dto/*.dto.ts` | DTOs: la "ficha de pedido" de crear y modificar, con las reglas de validación (`class-validator`) |
| `backend/src/productos/categorias.ts` | Categorías válidas (las usan los DTOs y el esquema) |
| `backend/src/productos/schemas/producto.schema.ts` | Esquema de Mongoose: la "plantilla de ficha" de cada producto en MongoDB (`timestamps`, `id` en vez de `_id`) |
| `backend/src/app.module.ts` | Conexión con MongoDB (`mongodb://127.0.0.1:27017/catalogo`) |
| `~/mongodb/` (fuera del proyecto) | MongoDB 9.0.8 (`bin/`) y sus datos (`data/`) |

---

## Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-11-19 | Las analogías serán siempre de una **tienda de tecnología** | Petición de la usuaria, encaja con el proyecto |
| 2026-11-19 | Servidor estático: **Python** (`python3 -m http.server`) en el **puerto 8080** | Ya estaba instalado y no descarga nada |
| 2026-11-19 | "Desplegar" significa **solo en local** (`localhost`); no se publica en internet | El despliegue está fuera de alcance en `CLAUDE.md` |
| 2026-11-19 | Se adelantó `app.js` (listar y crear) junto con más estilo | La usuaria pidió poder guardar productos al verlos sin funcionar |
| 2026-11-19 | Editar y borrar se dejan para un paso aparte | Avanzar en pasos pequeños |
| 2026-11-19 | 3 productos de ejemplo en el array (MacBook Air, MX Master 3S, ThinkVision P27h) | Para que el listado no empiece vacío |
| 2026-11-19 | El `id` se genera con un contador (`siguienteId`) | El modelo de datos lo indica para la fase 1 |
| 2026-11-19 | La validación en `app.js` aplica las reglas del modelo `Producto` | Coherencia con `CLAUDE.md` y con los DTOs de la fase 2 |
| 2026-11-20 | Se crea `BITACORA.md` para registrar el progreso y las decisiones | Petición de la usuaria, para no perder contexto |
| 2026-11-20 | Se empieza a usar **Git** (aunque `CLAUDE.md` decía "sin Git"), con identidad configurada solo para este proyecto | Petición de la usuaria, para llevar el historial de cambios |
| 2026-11-20 | `.gitignore` con `.DS_Store` | Es un archivo de macOS que no forma parte del proyecto |
| 2026-11-20 | Primer commit "fase 1" con la fase todavía en curso (faltan editar y borrar) | Foto del avance actual |
| 2026-11-20 | Repositorio remoto en GitHub: `https://github.com/candydavalos99-create/DEL_CIFO.git` (público), remoto `origin` | Guardar una copia del proyecto en GitHub |
| 2026-11-20 | Autenticación con **token fine-grained** (solo DEL_CIFO, Contents: lectura y escritura), guardado en el Llavero de macOS | Opción A elegida por la usuaria, sin instalar nada |
| 2026-11-20 | Se sube con el email real en los commits | Decisión de la usuaria |
| 2026-11-20 | La usuaria autoriza cerrar la fase 1 y hacer la fase 2 completa durante la pausa, sin esperar el "adelante" de cada paso | Petición de la usuaria |
| 2026-11-20 | Editar y borrar en la fase 1 con botones en cada fila; editar reutiliza el mismo formulario | Mantener la página sencilla |
| 2026-11-20 | Nest CLI con `npx` (versión 12.0.14), sin instalarlo de forma global | No instalar nada en el sistema |
| 2026-11-20 | `npm run start:dev` (modo desarrollo: se reinicia solo al cambiar el código) | Cómodo mientras aprendemos |
| 2026-11-20 | Validación **a mano en el servicio** (DTOs como clases sin decoradores) en vez de `class-validator` | `CLAUDE.md` pide preguntar antes de instalarlo; la usuaria estaba en la pausa. Los errores ya tienen el mismo formato (`400` con lista de mensajes) que daría `class-validator` |
| 2026-11-20 | La API devuelve el producto borrado en `DELETE` y responde 404 si el id no existe | Respuestas claras y fáciles de probar con `curl` |
| 2026-11-20 | CORS habilitado **solo** para `http://localhost:8080` | Indicado en `CLAUDE.md`: solo el origen del frontend |
| 2026-11-20 | El frontend mantiene una validación rápida, pero quien decide es el servidor | Aviso inmediato en la página; la regla real está en el backend |
| 2026-11-20 | Se instalan `class-validator` y `class-transformer` (en `backend/`) y la validación pasa a los DTOs, con `ValidationPipe` global (`whitelist` + `transform`) | Recomendación aceptada por la usuaria; es lo que indica `CLAUDE.md` |
| 2026-11-20 | Mensajes de validación en español y recorte de espacios en los textos | Coherencia con el frontend |
| 2026-11-20 | Las skills de Nest no se borran (falta respuesta), pero se excluyen de Git | No subir a GitHub archivos ajenos al proyecto sin borrar nada |
| 2026-11-20 | Commit "fase 2" (incluye el cierre de la fase 1) y push a GitHub | Petición de la usuaria |
| 2026-11-20 | MongoDB **no** con Homebrew: `/opt/homebrew` pertenece a otro usuario (ordenador del aula) y no se usa `sudo` | Sin permisos de administrador |
| 2026-11-20 | MongoDB **9.0.8** descargado de `fastdl.mongodb.org` en `~/mongodb` (huella SHA-256 verificada); datos en `~/mongodb/data` | Versión estable más reciente para Mac con chip Apple; no necesita contraseña |
| 2026-11-20 | `mongod` solo escucha en `127.0.0.1` y se arranca a mano (no arranca solo al encender el Mac) | Seguridad y control |
| 2026-11-20 | `mongosh` 2.14.1 con `npx` (el paquete del servidor no lo incluye) | Sin instalar nada más; versión con más de dos semanas |
| 2026-11-20 | `@nestjs/mongoose` 12.0.1 + `mongoose` 9.12.2 en `backend/` | Compatibles con Nest 12 |
| 2026-11-20 | Avisos de `npm audit`: 0 en las dependencias de la aplicación; 5 en herramientas de desarrollo del generador (`tmp`, `undici`). No se usa `audit fix --force` | Podría romper el proyecto; no afectan a la aplicación |
| 2026-11-20 | `producto.interface.ts` → `categorias.ts`; el tipo `Producto` pasa a ser el esquema de Mongoose | Evitar dos definiciones de Producto |
| 2026-11-20 | La API responde `id` (texto) en vez de `_id`, y añade `createdAt` y `updatedAt` | La API no cambia para el frontend; las fechas las indica `CLAUDE.md` para la fase 3 |
| 2026-11-20 | Un id con formato no válido (por ejemplo `99`) responde 404, no 500 | Mismo comportamiento que en la fase 2 |
| 2026-11-20 | Si la colección está vacía al arrancar, se insertan los 3 productos de ejemplo | Continuidad con las fases 1 y 2 |
| 2026-11-20 | Commit "fase 3" y push a GitHub | Incluido en el plan aprobado por la usuaria |

---

## Registro por sesiones

### 2026-11-19 · Sesión 1

1. **Lectura de `CLAUDE.md`** y explicación de las tres piezas (frontend, backend y base de datos) y de las tres fases.
2. **Comprobación de herramientas** (solo consultar, sin instalar nada):
   - Sistema: macOS
   - Python 3.9.6 ✅ · Node v26.13.1 ✅ · npm 11.20.0 ✅ · VS Code (`code`) ❌ no disponible en la terminal
3. **Elección del servidor:** Python en el puerto 8080.
4. **Petición de "desplegar":** se aclara que todavía no había web y que desplegar en internet está fuera de alcance.
5. **Creación de la página estática:** `frontend/index.html` y `frontend/styles.css` (formulario y tabla, sin lógica). Servidor arrancado y comprobado (respuesta 200).
6. **Más estilo y guardado de productos:**
   - `styles.css` rediseñado: cabecera con degradado, foco en los campos, etiquetas de categoría y de stock (verde, naranja si queda poco, rojo "Agotado"), precio en euros y contador.
   - `app.js` creado: array en memoria, listado, validación y creación de productos con avisos de éxito o de error.
   - `index.html`: se añaden la zona de avisos, el contador y la carga de `app.js`.
   - Comprobado: `node --check app.js` sin errores y los tres archivos con respuesta 200. La prueba de uso en el navegador la hace la usuaria.
7. Al cerrar la sesión, el servidor se detuvo.

### 2026-11-20 · Sesión 2

1. Repaso de dónde estábamos.
2. **Servidor arrancado de nuevo** (mismo comando, puerto 8080). Comprobado: `index.html`, `styles.css` y `app.js` responden con 200.
3. **Creación de `BITACORA.md`** (este archivo).
4. **Git:** ya estaba instalado (2.39.5). `git init` en el proyecto, identidad local configurada, `.gitignore` creado y primer commit "fase 1".
5. **GitHub:** se conecta el remoto `origin`, se crea el token en la web (paso a paso) y se hace `git push -u origin main`. GitHub ya tiene el commit `213ee23`.
6. **Pausa:** la usuaria pide cerrar la fase 1 y seguir con la fase 2.
7. **Cierre de la fase 1:**
   - `app.js`: editar (rellena el formulario y cambia a "Guardar cambios") y borrar (pide confirmación).
   - Probado en Chrome sin ventana con un script: crear, editar, borrar, validar ✅. **Al recargar, los datos se pierden** ✅ (limitación demostrada).
   - `README.md` creado con cómo arrancar el frontend.
8. **Fase 2 · paso 1:** Node v26.13.1 ✅, npm 11.20.0 ✅, Nest CLI no instalado → se usa con `npx`.
9. **Fase 2 · paso 2:** `npx @nestjs/cli@12.0.14 new backend --package-manager npm --skip-git`. "Hello World!" en http://localhost:3000 ✅. Se añaden `node_modules/` y `dist/` al `.gitignore`.
   - ⚠️ El generador instaló además unas "agent skills" en `backend/` (`.claude/skills`, `.agents/skills`, `AGENTS.md`). No se han pedido ni se usan: decisión pendiente.
10. **Fase 2 · paso 3:** `nest g module/controller/service productos` + DTOs, interfaz y lógica con el array en el servicio.
11. **Fase 2 · paso 4:** probado con `curl`: GET lista, GET uno, POST, PATCH, DELETE ✅, POST no válido → 400 con lista de errores ✅, id inexistente → 404 ✅.
12. **Fase 2 · paso 5:** `app.js` pasa a usar `fetch` contra la API.
    - Apareció el **error de CORS**: *"blocked by CORS policy: No 'Access-Control-Allow-Origin' header"*.
    - Se habilita en `main.ts` solo para `http://localhost:8080` → la cabecera `Access-Control-Allow-Origin: http://localhost:8080` aparece y la web funciona ✅.
13. **Cierre de la fase 2:**
    - En Chrome, la misma prueba completa ✅. **Al recargar la página, los datos siguen** ✅.
    - **Al reiniciar el backend, se pierden** ✅ (vuelven los 3 de ejemplo). Ojo: "tocar" un archivo sin cambiarlo no reinicia el modo desarrollo; hubo que parar y arrancar.
    - `README.md` actualizado (dos terminales, API, limitaciones).
14. Quedan **encendidos** el frontend (8080) y el backend (3000).
15. **Vuelta de la pausa:** la usuaria acepta instalar lo recomendado y pide commit y push de la fase 2.
16. **Validación con DTOs:** `npm install class-validator class-transformer` en `backend/`. Reglas en los DTOs y `ValidationPipe` global en `main.ts`. Se elimina la validación a mano del servicio.
    - ⚠️ **Fallo encontrado y corregido:** el PATCH borraba los campos no enviados (`{"id":"4","precio":899}`). Al convertir el JSON en DTO, las casillas no enviadas quedan como `undefined` y machacaban los datos. Arreglo: el servicio copia solo los campos con valor.
    - Probado de nuevo con `curl` (201, 200, 400, 404 ✅; campo desconocido descartado ✅; espacios recortados ✅) y en Chrome ✅.
17. **Git:** skills de Nest excluidas en `.gitignore`. Commit "fase 2" (`da88fcd`) y `git push` a GitHub.
18. **Fase 3 · paso 1:** `mongod` y `mongosh` no estaban instalados. Homebrew sí (4.3+). La usuaria da permiso para instalar.
    - ⚠️ `brew tap mongodb/brew` falló con *Permission denied*: Homebrew pertenece a otro usuario del ordenador.
    - Alternativa: MongoDB 9.0.8 descargado en `~/mongodb` (huella verificada). `mongosh` con `npx`. `ping: 1` ✅.
19. **Fase 3 · paso 2:** `npm install @nestjs/mongoose mongoose@9` en `backend/`. Conexión en `app.module.ts` con la BD `catalogo` ✅.
20. **Fase 3 · paso 3:** esquema `Producto` (`schemas/producto.schema.ts`) y servicio reescrito con el modelo de Mongoose (en lugar del array).
21. **Fase 3 · paso 4:** probado con `curl`: GET, POST (201, id generado por MongoDB), PATCH parcial, DELETE, 400 y 404 ✅. En `mongosh`: BD `catalogo`, colección `productos`, documentos con `_id` ✅.
22. **Fase 3 · paso 5:** `git diff` confirma **0 cambios en `frontend/`**, y la prueba completa en Chrome pasa ✅. La API no ha cambiado, así que el frontend no lo nota.
23. **Cierre de la fase 3:** se apagan backend y MongoDB (puertos 3000 y 27017 cerrados), se vuelven a encender y **los datos se mantienen** ✅ (iPhone a 899 €, AirPods, MX Master sigue borrado). README completado (tres piezas y recorrido de una petición). Commit "fase 3" y push.

---

## Ideas clave aprendidas

- **Frontend** = escaparate y mostrador: lo que el cliente ve y usa en el navegador.
- **Git** = libro de inventario con fecha: cada **commit** es una foto del proyecto. **Remoto** (`origin`) = el almacén central en GitHub. **Push** = enviar los commits al almacén central. **Token** = tarjeta de acceso al almacén, con permisos limitados y fecha de caducidad.
- **Servidor estático** = entrega los archivos de una carpeta tal cual. Lo usamos para trabajar con `http://` como una web real y evitar problemas en la fase 2.
- **localhost** = este mismo ordenador. **Puerto** = la "puerta" por la que escucha un programa (8080 para el frontend).
- **Limitación de la fase 1:** los datos viven en un array del navegador y se pierden al recargar la página. La fase 2 (backend) lo resolverá.
- **Backend** = la trastienda: recibe pedidos, aplica las reglas y guarda el inventario.
- **API REST** = el "menú de pedidos" que ofrece el backend: cada **endpoint** es un método + una ruta (por ejemplo `POST /productos`). Se habla en **JSON** (texto con formato de datos).
- **Módulo** = una sección de la tienda (productos). **Controlador** = el mostrador que atiende cada ruta. **Servicio** = el almacén y su encargado (datos y reglas). **DTO** = la ficha de pedido: qué datos debe traer la petición.
- **Códigos HTTP:** `200` todo bien · `201` creado · `400` datos no válidos · `404` no existe.
- **`class-validator`** = las etiquetas de reglas en la ficha de pedido (`@Length(2, 100)`, `@Min(0)`...). **`ValidationPipe`** = el revisor de la entrada, que comprueba cada ficha antes de que llegue al mostrador y la rechaza con un 400 si algo falla.
- **`fetch`** = la forma en que el navegador hace peticiones HTTP a la API.
- **CORS** = el guardia de seguridad del navegador. Una web en `localhost:8080` solo puede leer respuestas de `localhost:3000` si ese servidor dice expresamente "te autorizo" (cabecera `Access-Control-Allow-Origin`). Distinto puerto = distinto **origen**.
- **Limitación de la fase 2:** los datos viven en la memoria del servidor. Sobreviven a recargar la página, pero se pierden al reiniciar el backend. La fase 3 (MongoDB) lo resolverá.
- **Base de datos (MongoDB)** = el almacén con registro: guarda los datos en disco y se mantienen aunque se apague todo. Dentro hay **bases de datos** (`catalogo`), **colecciones** (`productos`, una estantería) y **documentos** (cada producto, con su `_id`).
- **`mongod`** = el servidor de MongoDB (puerto 27017). **`mongosh`** = la consola para mirar dentro del almacén.
- **Mongoose / ODM** = el traductor entre NestJS (objetos de JavaScript) y MongoDB (documentos). **Esquema** = la plantilla de ficha de cada producto en el almacén. **Modelo** = la herramienta para buscar, crear, modificar y borrar en una colección.
- **Idea clave de la fase 3:** la API (rutas y JSON) **no ha cambiado**. Solo ha cambiado dónde guarda los datos el servicio. Por eso el frontend ha funcionado sin tocar ni una línea.
- **Resultado de la fase 3:** los datos se mantienen al recargar la página, al reiniciar el backend y al reiniciar MongoDB.
