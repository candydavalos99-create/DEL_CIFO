# Bitácora del proyecto

Registro de todo lo que hacemos y de las decisiones que tomamos, para no perder el contexto entre sesiones.
Se actualiza al terminar cada paso. Las reglas generales del proyecto están en `CLAUDE.md`.

---

## Estado actual (resumen rápido)

- **Fase:** 1 · Solo frontend
- **Hecho:** página con formulario y listado, estilos, listar productos y crearlos (guardar).
- **Pendiente en la fase 1:** editar y borrar productos y cerrar la fase (recargar para ver que se pierden los datos y escribir el README).
- **Siguiente paso:** añadir **editar y borrar** en `app.js` (te lo explicaré y esperaré tu "adelante").
- **Cómo ver la web:** arrancar el servidor (ver abajo) y abrir http://localhost:8080

### Cómo arrancar el frontend

```bash
cd /Users/alumne_mati1/proyectos/actividad01/frontend && python3 -m http.server 8080
```
Después, abrir http://localhost:8080 en el navegador. Para pararlo: `Ctrl + C` en esa terminal.
Si se ve una versión antigua de la página: `Cmd + Shift + R`.

### Archivos actuales

| Archivo | Papel |
|---|---|
| `CLAUDE.md` | Reglas, fases y modelo de datos del proyecto |
| `BITACORA.md` | Este registro |
| `.gitignore` | Archivos que Git debe ignorar (`.DS_Store`) |
| `frontend/index.html` | Estructura: cabecera, formulario, zona de avisos, tabla del listado |
| `frontend/styles.css` | Aspecto: degradado, tarjetas, etiquetas de color de categoría y stock |
| `frontend/app.js` | Comportamiento: array de productos, pintar la lista, validar y guardar |

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

---

## Ideas clave aprendidas

- **Frontend** = escaparate y mostrador: lo que el cliente ve y usa en el navegador.
- **Servidor estático** = entrega los archivos de una carpeta tal cual. Lo usamos para trabajar con `http://` como una web real y evitar problemas en la fase 2.
- **localhost** = este mismo ordenador. **Puerto** = la "puerta" por la que escucha un programa (8080 para el frontend).
- **Limitación de la fase 1:** los datos viven en un array del navegador y se pierden al recargar la página. La fase 2 (backend) lo resolverá.
