# Catálogo de productos tecnológicos

Proyecto de aprendizaje: una web con un formulario y un listado de productos tecnológicos (crear, listar, editar y borrar), construida en tres fases.

## Cómo arrancarlo (fase 2)

Hacen falta **dos terminales**, una para cada pieza.

**1. Backend (API NestJS, puerto 3000)**

Requisitos: Node y npm. La primera vez, instala las dependencias:

```bash
cd backend
npm install
```

Para arrancarlo:

```bash
cd backend
npm run start:dev
```

Comprobar: http://localhost:3000/productos debe mostrar los productos en JSON.

**2. Frontend (puerto 8080)**

Requisitos: Python 3.

```bash
cd frontend
python3 -m http.server 8080
```

Abrir http://localhost:8080 en el navegador. Para parar cualquiera de los dos: `Ctrl + C`.

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

## Limitaciones por fase

- **Fase 1** (solo frontend): los datos vivían en el navegador y se perdían al recargar la página.
- **Fase 2** (frontend + backend): los datos viven en la memoria del servidor. Sobreviven a recargar la página, pero **se pierden al reiniciar el backend**. La fase 3 (MongoDB) lo resolverá.
