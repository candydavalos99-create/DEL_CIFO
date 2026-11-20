# Bitácora del proyecto

Registro de todo lo que hacemos y de las decisiones que tomamos, para no perder el contexto entre sesiones.
Se actualiza al terminar cada paso. Las reglas generales del proyecto están en `CLAUDE.md`.

---

## Estado actual (resumen rápido)

- **Fase:** 3 · Frontend + backend + MongoDB → **terminada**. **Proyecto completo** (fases 1, 2 y 3).
- **Hecho:** CRUD completo con los datos guardados en MongoDB (BD `catalogo`, colección `productos`). Los datos **se mantienen** al reiniciar todo.
- **Validación:** DTOs + `class-validator` (petición) y esquema de Mongoose (base de datos).
- **Git:** commit "fase 3" subido a GitHub.
- **Extra (fuera de las 3 fases):** escaparate para el cliente en `frontend/tienda.html`, con la misma API y solo lectura.
- **Despliegue en Render:** archivos y guía preparados (`DESPLIEGUE.md`, `.github/workflows/deploy.yml`). ✅ **MongoDB Atlas listo** (Project 0 · Cluster0 M0 · Frankfurt). Credenciales en `~/mongodb/atlas-credenciales.txt` (privado, fuera del proyecto). **Falta:** commit y push, Render y los secretos de GitHub.
- **Pendiente:** nada por decidir. Todo subido a GitHub (último commit: "limpieza final").
- **Repositorio en GitHub:** https://github.com/candydavalos99-create/DEL_CIFO (para subir cambios: `git push`)
- **Cómo ver la web:** arrancar las tres piezas (ver abajo). Panel de gestión: http://localhost:8080 · Tienda para el cliente: http://localhost:8080/tienda.html
- **Ver MongoDB:** doble clic en `~/mongodb/ver-catalogo-en-vivo.command` (se actualiza solo) o en `~/mongodb/ver-catalogo.command` (a mano, con `ver()`)

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
| `.gitignore` | Archivos que Git debe ignorar (`.DS_Store`, `node_modules/`, `dist/`, `*.tsbuildinfo`) |
| `frontend/index.html` | Estructura: cabecera, formulario, zona de avisos, tabla del listado |
| `frontend/styles.css` | Aspecto: degradado, tarjetas, etiquetas de color, botones de fila |
| `frontend/tienda.html` · `tienda.css` · `tienda.js` | Escaparate para el cliente: tarjetas, buscador, filtro por categoría y orden. Solo `GET /productos` |
| `frontend/config.js` | Dirección de la API: `http://localhost:3000` en local; en Render lo reescribe `generar-config.sh` con `API_URL` |
| `frontend/generar-config.sh` | Build Command del Static Site de Render: genera `config.js` con la URL del backend |
| `DESPLIEGUE.md` | Guía paso a paso para publicar en Render + MongoDB Atlas con GitHub Actions |
| `.github/workflows/deploy.yml` | GitHub Actions: compila el backend, revisa el JS del frontend y, si todo va bien, llama a los Deploy Hooks de Render |
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
| `~/mongodb/` (fuera del proyecto) | MongoDB 9.0.8 (`bin/`), sus datos (`data/`) y los lanzadores `ver-catalogo.command` y `ver-catalogo-en-vivo.command` |

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
| 2026-11-20 | Se **borran** las skills de Nest (`backend/.claude/`, `backend/.agents/`, `backend/AGENTS.md`) y sus líneas del `.gitignore` | La usuaria pidió borrarlas si no hacían falta: son guías para asistentes de IA, la app no las usa y se pueden reinstalar con `npx @nestjs/skills add` |
| 2026-11-20 | La cabecera de la web pasa a "Fase 3 · Frontend + backend + MongoDB" | Petición de la usuaria, una vez demostrado que el frontend funcionaba sin tocarlo |
| 2026-11-20 | Lanzadores de `mongosh` en `~/mongodb` (fuera del proyecto): `ver-catalogo.command` (atajo `ver()`) y `ver-catalogo-en-vivo.command` | La usuaria quería ver en MongoDB lo que añade en la web |
| 2026-11-20 | El monitor en vivo redibuja cada 2 s con un reloj ("Comprobado a las…") y "Último cambio" | La primera versión solo redibujaba al detectar cambios y la usuaria vio que "dejó de actualizarse"; con el reloj se sabe si sigue vivo |
| 2026-11-20 | Se añade un **escaparate para el cliente** (`tienda.html`), aparte del panel de gestión | Para entender la diferencia entre lo que ve el cliente y el back-office. Es un extra fuera de las 3 fases, pedido por la usuaria |
| 2026-11-20 | Sin fotos (la subida de imágenes está fuera de alcance): icono y color según la categoría | Respetar el alcance de `CLAUDE.md` |
| 2026-11-20 | Navegación "Tienda / Panel de gestión" en las dos páginas | Pasar de una vista a otra |
| 2026-11-20 | **Despliegue en Render** (plan gratuito), aunque `CLAUDE.md` lo dejaba fuera de alcance | Petición de la usuaria |
| 2026-11-20 | Base de datos en **MongoDB Atlas M0** (gratis), aunque `CLAUDE.md` excluía Atlas | Render no ofrece MongoDB y su plan gratuito no tiene disco permanente; en local se sigue usando MongoDB local |
| 2026-11-20 | Despliegue con **GitHub Actions + Deploy Hooks** de Render; auto-deploy de Render apagado | Petición de la usuaria: GitHub Actions comprueba (compila backend, revisa JS) y solo despliega si todo va bien |
| 2026-11-20 | Si faltan los secretos de los Deploy Hooks, el workflow avisa (amarillo) y no despliega, en vez de fallar | El primer push ocurre antes de crear los servicios en Render |
| 2026-11-20 | Servicios creados a mano en el panel de Render (sin `render.yaml`) | Más fácil de seguir; la documentación de Render no garantiza que el sitio estático pueda leer la URL pública del backend desde el Blueprint |
| 2026-11-20 | Configuración por **variables de entorno**: `MONGODB_URI`, `CORS_ORIGIN` (admite varias, separadas por comas) y `PORT` en el backend; `API_URL` → `config.js` en el frontend. Los valores por defecto son los de local | No escribir secretos ni direcciones de producción en el código |
| 2026-11-20 | Node 24 en GitHub Actions (el que usa Render por defecto) y `engines: node >=20.19` en `backend/package.json` | Nest 12 pide ≥ 20, Mongoose 9 pide ≥ 20.19 |
| 2026-11-20 | Mensaje "Cargando productos… (puede tardar hasta 1 minuto)" en el panel y en la tienda | El backend gratuito se duerme tras 15 min y tarda ~1 min en despertar |
| 2026-11-20 | Aviso en la guía: el panel de gestión no tiene inicio de sesión | Una vez publicado, cualquiera con la dirección podría editar o borrar |
| 2026-11-20 | Atlas se configura con la **Atlas CLI** oficial (1.59.1, huella verificada, en `~/mongodb/bin/atlas`); la usuaria aprueba el acceso en el navegador con un código | La usuaria pidió que lo hiciera yo; así no tiene que dar su contraseña |
| 2026-11-20 | Se usa el proyecto existente **"Project 0"** (estaba vacío) en vez de crear uno nuevo | Cuenta recién creada, sin nada más |
| 2026-11-20 | Usuario `catalogo_app` (readWriteAnyDatabase) con contraseña aleatoria guardada en `~/mongodb/atlas-credenciales.txt` (permisos 600); nunca se muestra en el chat | No exponer secretos |
| 2026-11-20 | Acceso de red `0.0.0.0/0` | Render gratuito no tiene IP fija |

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
23. **Cierre de la fase 3:** se apagan backend y MongoDB (puertos 3000 y 27017 cerrados), se vuelven a encender y **los datos se mantienen** ✅ (iPhone a 899 €, AirPods, MX Master sigue borrado). README completado (tres piezas y recorrido de una petición). Commit "fase 3" (`744ad23`) y push.
24. **Limpieza:** se comprueba que ningún archivo de la app usa las skills de Nest y se borran. La cabecera de la web se actualiza a fase 3. La web sigue cargando los 4 productos ✅. Commit "limpieza final" y push.

---

### 2026-11-20 · Sesión 2 (continuación)

25. **Ver MongoDB:** la usuaria quiere ver en la base de datos lo que añade en la web. Se crea `~/mongodb/ver-catalogo.command` (consola con el atajo `ver()`) y se abre en su pantalla. Se ve su producto nuevo ("Laptop") ✅.
26. **Monitor en vivo:** `~/mongodb/ver-catalogo-en-vivo.command` actualiza la tabla sola. La usuaria indica que "dejó de actualizarse": el proceso seguía vivo y los datos llegaban a MongoDB, pero no se podía saber si estaba esperando o colgado. Nueva versión con reloj cada 2 s ✅ (probada detectando un producto de prueba, que después se borra).
27. **¿Qué ve el usuario?** Se explica la diferencia entre el frontend (lo que ve la persona), el backend (sin pantalla) y la consola de MongoDB (solo para la desarrolladora). Lo que hemos hecho es el **panel de gestión** (back-office) de la tienda.
28. **Escaparate para el cliente:** `frontend/tienda.html`, `tienda.css` y `tienda.js`. Tarjetas con icono por categoría, buscador, filtro, orden y disponibilidad ("En stock", "¡Últimas N!", "Agotado"). Sin botones de editar ni borrar. Probado en Chrome (búsqueda, filtro, orden y "sin resultados") y revisado con capturas de escritorio y de móvil ✅. Corregidos: icono de tablet y etiqueta de stock pegada al borde con precios largos. **Pendiente de commit.**

---

29. **Preparar el despliegue en Render con GitHub Actions:**
    - Documentación de Render consultada: el servidor gratuito se duerme a los 15 min y tarda ~1 min en despertar; 750 h/mes; sin disco permanente; Node 24 por defecto.
    - Backend: `MONGODB_URI` y `CORS_ORIGIN` por variables de entorno. Compilado y arrancado en **modo producción** (`node dist/main`, puerto 3100): health check 200, 11 productos, CORS acepta el origen de Render y bloquea otra web ✅.
    - Frontend: `config.js` + `generar-config.sh` (probado con y sin `API_URL`) ✅. Panel y tienda siguen funcionando en local ✅.
    - `.github/workflows/deploy.yml`: YAML validado ✅ (todavía no se ha ejecutado en GitHub).
    - `DESPLIEGUE.md`: guía en 7 pasos (Atlas → backend → frontend → CORS → Deploy Hooks → primer despliegue → comprobación), con limitaciones, problemas frecuentes y seguridad.
    - **Pendiente:** commit y push, y los pasos que solo puede hacer la usuaria (cuentas, contraseñas y secretos).
30. **MongoDB Atlas (paso 1 de la guía), hecho por mí con la Atlas CLI:**
    - El primer intento de descargar la CLI lo bloqueó el sistema de permisos; la usuaria lo autorizó pegando el comando.
    - Inicio de sesión con código de un solo uso, aprobado por la usuaria en el navegador.
    - Cluster0 (M0, AWS Frankfurt) creado; usuario `catalogo_app`; acceso `0.0.0.0/0`; dirección de conexión con `/catalogo` guardada en el archivo privado.
    - Probado: `ping: 1` ✅ y backend en modo producción contra Atlas → crea los 3 productos de ejemplo ✅.

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
- **Desplegar** = publicar en un servidor de internet. **Variable de entorno** = configuración que se da desde fuera del código (la etiqueta con la dirección del almacén para cada sucursal). **Secreto** = variable que no debe verse nunca (nunca va a GitHub).
- **GitHub Actions** = la cadena de montaje automática: en cada push comprueba el código y, si está bien, avisa a Render con un **Deploy Hook** (el timbre que dice "hay mercancía nueva, publica").
- **Una misma API, varias pantallas:** el panel de gestión (personal) y la tienda (cliente) usan el mismo backend y la misma base de datos. Lo que el personal da de alta aparece en el escaparate, sin duplicar datos.
- **Resultado de la fase 3:** los datos se mantienen al recargar la página, al reiniciar el backend y al reiniciar MongoDB.
