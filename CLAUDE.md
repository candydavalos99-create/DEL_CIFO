# Proyecto: Catálogo de productos tecnológicos (Actividad 01 Candy)

## Objetivo

Es un proyecto de **aprendizaje**. La meta es **entender las piezas** de una aplicación fullstack y cómo se comunican entre sí, **no aprender a programar**.
Las explicaciones se centran en la arquitectura (qué es cada pieza, qué hace y con quién habla), no en la sintaxis.

La aplicación es una web sencilla con un formulario y un listado de productos tecnológicos, con operaciones completas: crear, listar, editar y borrar.

El proyecto se construye **pieza a pieza, en tres fases**. Cada fase deja la aplicación funcionando y añade una pieza nueva:

1. **Frontend solo:** los datos viven en el navegador.
2. **+ Backend:** los datos pasan a vivir en la memoria del servidor.
3. **+ MongoDB:** los datos se guardan en una base de datos y ya no se pierden.

## Stack

| Pieza | Tecnología | Fase | Notas |
|---|---|---|---|
| Frontend | HTML, CSS3, JavaScript | 1 | Sin frameworks ni librerías. |
| Backend | NestJS (TypeScript) | 2 | API REST con JSON. El frontend le hace peticiones con `fetch`. |
| Acceso a datos | Mongoose (`@nestjs/mongoose`) | 3 | Es el ODM, el "traductor" entre NestJS y MongoDB. |
| Base de datos | MongoDB instalado en local | 3 | Sin Docker ni Atlas. |
| Entorno | Local, en macOS o Linux | — | Detectar cuál de los dos antes de dar comandos de instalación. |

**Por ahora no hay autenticación ni se usa Git.**

## Evolución de la arquitectura

```
FASE 1   ┌──────────────────────┐
         │  Navegador           │   Los datos están en un array de JS.
         │  frontend/           │   → Si recargas la página, se pierden.
         └──────────────────────┘

FASE 2   ┌──────────────────────┐   HTTP + JSON    ┌──────────────────────┐
         │  Navegador           │ ───────────────▶ │  API NestJS          │   Los datos están en un array del servidor.
         │  frontend/           │ ◀─────────────── │  backend/ · :3000    │   → Si reinicias el servidor, se pierden.
         └──────────────────────┘                  └──────────────────────┘

FASE 3   ┌──────────────────────┐   HTTP + JSON    ┌──────────────────────┐   Mongoose   ┌──────────────────────┐
         │  Navegador           │ ───────────────▶ │  API NestJS          │ ───────────▶ │  MongoDB             │
         │  frontend/           │ ◀─────────────── │  backend/ · :3000    │ ◀─────────── │  BD: catalogo        │
         └──────────────────────┘                  └──────────────────────┘              │  :27017              │
                                                                                         └──────────────────────┘
                                                                                         → Los datos se mantienen.
```

El límite de cada fase (los datos se pierden) es lo que justifica la siguiente. Hay que señalarlo de forma explícita al terminar cada fase.

## Modelo de datos: `Producto`

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `id` | texto | automático | En las fases 1 y 2 se genera a mano. En la fase 3 lo genera MongoDB (`_id`). |
| `nombre` | texto | sí | Entre 2 y 100 caracteres. |
| `marca` | texto | sí | Por ejemplo: Apple, Lenovo o Logitech. |
| `categoria` | texto | sí | Uno de estos valores: `portatil`, `sobremesa`, `movil`, `tablet`, `monitor`, `periferico`, `audio`, `otro`. |
| `precio` | número | sí | Mayor o igual que 0, en euros. |
| `stock` | número entero | no | Mayor o igual que 0. Por defecto vale 0. |
| `descripcion` | texto | no | Máximo 500 caracteres. |
| `createdAt` / `updatedAt` | fecha | automático | Solo en la fase 3. Los añade Mongoose con `timestamps`. |

## API REST (a partir de la fase 2)

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/productos` | Lista todos los productos. |
| GET | `/productos/:id` | Devuelve un producto. |
| POST | `/productos` | Crea un producto. |
| PATCH | `/productos/:id` | Modifica un producto. |
| DELETE | `/productos/:id` | Borra un producto. |

- Validación con DTOs. Antes de instalar `class-validator` y `class-transformer`, preguntar.
- Probar cada endpoint con `curl` **antes** de conectarlo al frontend, para comprobar que el backend funciona por sí solo.
- La API (rutas y formato JSON) **no cambia** al pasar de la fase 2 a la 3. Solo cambia dónde se guardan los datos, y el frontend no debería notarlo. Esto es una idea clave que hay que explicar.

## Estructura de carpetas prevista

```
actividad-01/
├── CLAUDE.md
├── README.md            ← cómo arrancar cada pieza (se va ampliando en cada fase)
├── frontend/            ← fase 1
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── backend/             ← fase 2, generado con Nest CLI
    └── src/
        └── productos/   ← módulo, controlador, servicio y DTOs (+ esquema en la fase 3)
```

## Fases y pasos (orientativos; se confirman con la usuaria)

Al empezar cada fase, comprobar **solo** las herramientas que necesita esa fase. Es una comprobación: no se instala nada sin permiso.

### Fase 1 · Frontend simple

1. Comprobar qué hace falta: un navegador y un servidor estático sencillo. Proponer opciones de servidor y que la usuaria elija.
2. Crear la carpeta `frontend/` con la página estática: HTML y CSS del formulario y del listado, todavía sin lógica.
3. `app.js`: listar productos de un array de ejemplo en memoria.
4. `app.js`: crear, editar y borrar productos en ese array.
5. Cierre de la fase:
   - recargar la página y ver que los datos se pierden,
   - explicar por qué y qué pieza lo resolverá,
   - anotar en el README cómo arrancar el frontend.

### Fase 2 · Añadir backend (NestJS)

1. Comprobar `node`, `npm` y Nest CLI.
2. Generar el proyecto NestJS en `backend/` y arrancarlo ("Hello World" en el puerto 3000).
3. Crear el módulo `productos`: controlador, servicio y DTOs, con los datos en un array **dentro del servicio**.
4. Probar el CRUD con `curl`.
5. Cambiar `app.js` para que use `fetch` contra la API en lugar del array local. Aquí aparece **CORS**: cuando salga el error, se explica qué es y por qué ocurre, y después se habilita en NestJS solo para el origen del frontend.
6. Cierre de la fase:
   - comprobar que al recargar la página los datos siguen ahí,
   - reiniciar el servidor y ver que se pierden,
   - explicar por qué,
   - actualizar el README.

### Fase 3 · Añadir MongoDB

1. Comprobar `mongod` y `mongosh`. Arrancar MongoDB y comprobar que responde.
2. Instalar Mongoose y conectar NestJS con la base de datos `catalogo`.
3. Crear el esquema `Producto` y cambiar el servicio para que use la base de datos en lugar del array.
4. Probar con `curl` y ver los datos directamente en `mongosh`.
5. Comprobar que el frontend funciona **sin haberlo tocado**.
6. Cierre del proyecto:
   - reiniciar todo y ver que los datos se mantienen,
   - repasar el recorrido completo de una petición, del navegador a la base de datos y de vuelta,
   - completar el README.

## Forma de trabajar (OBLIGATORIA)

1. **Antes de cada paso**, explicar:
   - qué vamos a hacer y por qué,
   - qué pieza de la arquitectura toca,
   - qué archivos se crean o cambian,
   - qué comandos se van a ejecutar.

   Después, **esperar la aprobación explícita de la usuaria.** Sin un "OK" no se avanza.
2. **Un paso cada vez** y pequeño. Nunca encadenar varios pasos ni adelantar trabajo de una fase posterior.
3. **Después de cada paso**, explicar:
   - qué se ha creado y dónde encaja en el diagrama,
   - cómo comprobar que funciona (un comando o una acción en el navegador) y qué resultado debería verse.
4. **Preguntar siempre.** Ante cualquier duda o ambigüedad, preguntar en vez de suponer. Tomarse el tiempo necesario; no hay prisa.
5. **No** instalar dependencias, cambiar la estructura ni añadir funcionalidades sin preguntar antes.
6. **Comandos que instalan en el sistema** (`brew`, `apt`, `sudo`…): explicar qué hacen y pedir permiso. Si requieren contraseña, que los ejecute la usuaria.
7. **Si algo falla:** primero explicar el error en lenguaje claro y qué lo provoca; después, proponer la solución y esperar el OK.
8. **Al cerrar cada fase**, hacer un pequeño resumen:
   - qué pieza se ha añadido,
   - qué ha cambiado en el diagrama,
   - qué limitación queda y que resolverá la fase siguiente.

## Estilo de las explicaciones

- En español, con lenguaje claro y analogías cuando ayuden.
- Definir cada término nuevo la primera vez que aparezca: endpoint, puerto, CORS, DTO, esquema, módulo, controlador, servicio, etc.
- En el código, comentarios breves en español que expliquen **qué papel cumple** cada bloque.
- No profundizar en sintaxis salvo que la usuaria lo pida.

## Fuera de alcance (por ahora)

Git, autenticación, despliegue, Docker, frameworks de frontend, tests automáticos, paginación y subida de imágenes.
