# Cómo seguir el lunes

## 1. Abre Claude Code en la carpeta del proyecto

En la app **Terminal**:

```bash
cd /Users/alumne_mati1/proyectos/actividad01
claude
```

## 2. Copia y pega este prompt

```text
Hola, seguimos con el proyecto del catálogo. Antes de hacer nada:

1. Lee CLAUDE.md (reglas del proyecto) y BITACORA.md (todo lo hecho y las decisiones),
   sobre todo "Estado actual" y los últimos pasos del registro de sesiones.
   Ten en cuenta que hay decisiones posteriores a CLAUDE.md que lo amplían:
   Git y GitHub, la tienda para el cliente, MongoDB Atlas y el despliegue en Render con GitHub Actions.
2. Resúmeme en pocas líneas dónde lo dejamos y cuál es el siguiente paso.

Dónde lo dejamos: estábamos desplegando en Render siguiendo DESPLIEGUE.md.
- MongoDB Atlas ya está listo (Cluster0 M0 en Frankfurt, usuario catalogo_app).
  La dirección secreta (MONGODB_URI) está en ~/mongodb/atlas-credenciales.txt:
  no la muestres nunca en el chat; si la necesito, cópiamela al portapapeles con pbcopy.
- El código está en GitHub (commit b040ca0) y GitHub Actions sale en verde
  (con el aviso amarillo de que faltan los Deploy Hooks, que es lo esperado).
- Me quedé rellenando en Render el formulario del Web Service del backend
  (catalogo-backend), en la parte de Environment Variables.
  No sé si llegué a pulsar "Deploy Web Service": pregúntame primero qué veo en Render.

Lo que falta (pasos de DESPLIEGUE.md):
- Paso 2: terminar el backend en Render y comprobar /productos.
- Paso 3: crear el Static Site (catalogo-frontend) con API_URL = URL del backend.
- Paso 4: poner en el backend CORS_ORIGIN = URL del frontend.
- Paso 5: Deploy Hooks de Render → secretos de GitHub
  (RENDER_DEPLOY_HOOK_BACKEND y RENDER_DEPLOY_HOOK_FRONTEND).
- Pasos 6 y 7: primer despliegue con GitHub Actions y comprobación final.

Cómo quiero trabajar: guíame pantalla por pantalla, con un paso cada vez y en español sencillo.
Lo que puedas hacer tú, hazlo tú. Usa analogías de una tienda de tecnología.
Actualiza BITACORA.md al terminar cada paso.
```

## 3. Si quieres ver la web en local mientras tanto

Las tres piezas se apagan al cerrar la sesión. Para encenderlas, usa **tres terminales, en este orden**:

```bash
# 1 · MongoDB local
~/mongodb/bin/mongod --dbpath ~/mongodb/data --bind_ip 127.0.0.1 --port 27017

# 2 · Backend
cd /Users/alumne_mati1/proyectos/actividad01/backend && npm run start:dev

# 3 · Frontend
cd /Users/alumne_mati1/proyectos/actividad01/frontend && python3 -m http.server 8080
```

Después abre http://localhost:8080 (panel de gestión) o http://localhost:8080/tienda.html (tienda).
Para ver la base de datos en vivo: doble clic en `~/mongodb/ver-catalogo-en-vivo.command`.

## Archivos importantes

| Archivo | Para qué |
|---|---|
| `BITACORA.md` | Todo lo hecho, las decisiones y el estado actual |
| `DESPLIEGUE.md` | La guía de Render paso a paso |
| `README.md` | Cómo arrancar el proyecto en local y las variables de entorno |
| `~/mongodb/atlas-credenciales.txt` | **Secreto**: usuario, contraseña y dirección de Atlas. No compartir ni subir a GitHub |
