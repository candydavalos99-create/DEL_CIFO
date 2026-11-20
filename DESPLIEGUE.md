# Guía de despliegue en Render (plan gratuito) con GitHub Actions

Esta guía publica en internet el catálogo completo (frontend, backend y base de datos), paso a paso.

---

## 0. Cómo quedará

```
                     internet
┌──────────────────────────────┐  HTTPS + JSON  ┌──────────────────────────────┐   Mongoose   ┌──────────────────────┐
│  RENDER · Static Site        │ ─────────────▶ │  RENDER · Web Service (Free) │ ───────────▶ │  MONGODB ATLAS (M0)  │
│  catalogo-frontend           │ ◀───────────── │  catalogo-backend            │ ◀─────────── │  BD: catalogo        │
│  (tienda.html + panel)       │                │  (API NestJS)                │              │  (gratis, en la nube)│
└──────────────────────────────┘                └──────────────────────────────┘              └──────────────────────┘

            GitHub (push a main) ──▶ GitHub Actions: compila y revisa ──▶ si todo OK ──▶ avisa a Render (Deploy Hooks)
```

| Pieza local | En internet | Por qué |
|---|---|---|
| `frontend/` con `python3 -m http.server` | **Render Static Site** (gratis) | Solo hay que entregar archivos tal cual: es un servidor estático |
| `backend/` con `npm run start:dev` | **Render Web Service** (plan *Free*) | Un programa Node que tiene que estar en marcha |
| MongoDB en `~/mongodb` | **MongoDB Atlas** (plan *M0*, gratis) | Render no ofrece MongoDB, y su plan gratuito no guarda archivos de forma permanente |

**GitHub Actions** es la "cadena de montaje" automática de GitHub. Con cada `push` a `main`:
1. comprueba que el backend se instala y compila, y que el JavaScript del frontend no tiene errores;
2. **solo si todo está bien**, avisa a Render para que despliegue.

Si algo está roto, **no se publica**. El archivo que lo define es `.github/workflows/deploy.yml`.

### Vocabulario nuevo
- **Desplegar:** publicar la aplicación en un servidor de internet.
- **Variable de entorno:** un dato de configuración que se le da al programa desde fuera, sin escribirlo en el código. Por ejemplo, la dirección de la base de datos. En la tienda de tecnología, es la **etiqueta con la dirección del almacén** que se le da a cada sucursal.
- **Secreto:** una variable de entorno que no debe verse nunca, como una contraseña. **Nunca se sube a GitHub.**
- **Deploy Hook:** una dirección secreta de Render. Al llamarla, Render despliega el servicio. Es como el **timbre** que avisa de que llega mercancía nueva.

---

## 1. Antes de empezar

- [ ] Una cuenta de **GitHub** con el repositorio `DEL_CIFO` y el código subido (ya la tienes).
- [ ] Una cuenta de **Render** (ya la tienes).
- [ ] Una cuenta de **MongoDB Atlas**. Se crea gratis en https://www.mongodb.com/cloud/atlas/register
- [ ] Un lugar privado donde **apuntar temporalmente** contraseñas y direcciones. No las pegues en el chat ni en archivos del proyecto.

> Los nombres `catalogo-backend` y `catalogo-frontend` son los propuestos. Si Render te dice que ya existen, elige otros y **usa siempre tus direcciones reales** en los pasos siguientes.

---

## 2. Paso 1 · Base de datos en MongoDB Atlas

1. Entra en Atlas y crea un **proyecto** (por ejemplo, `catalogo`).
2. **Create** → plan **M0 (Free)**.
   - *Provider:* AWS · *Region:* **Frankfurt (eu-central-1)**. Así queda cerca del backend en Render.
   - *Name:* `Cluster0`.
3. **Usuario de la base de datos** (*Database Access*):
   - Usuario: `catalogo_app`.
   - Contraseña: pulsa **Autogenerate** (genera solo letras y números, que evitan problemas en la dirección) y **guárdala**.
   - Permiso: *Read and write to any database*.
4. **Acceso de red** (*Network Access*) → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   - ¿Por qué? El plan gratuito de Render no tiene una dirección IP fija, así que no podemos autorizar solo esa. La protección es el usuario y la contraseña.
5. **Dirección de conexión:** *Connect* → *Drivers* → copia la dirección. Será algo como:
   ```
   mongodb+srv://catalogo_app:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
   Haz **dos cambios**:
   - sustituye `<db_password>` por la contraseña (sin `< >`);
   - añade el nombre de la base de datos, **`catalogo`**, justo antes del `?`:
   ```
   mongodb+srv://catalogo_app:TU_CONTRASEÑA@cluster0.abcde.mongodb.net/catalogo?retryWrites=true&w=majority&appName=Cluster0
   ```
   Esta es tu **`MONGODB_URI`**. Es **secreta**.

---

## 3. Paso 2 · Backend en Render (Web Service)

1. En https://dashboard.render.com → **New +** → **Web Service**.
2. Conecta GitHub, si te lo pide, y elige el repositorio **`DEL_CIFO`**.
3. Rellena:

| Campo | Valor |
|---|---|
| Name | `catalogo-backend` |
| Region | **Frankfurt (EU Central)** |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime / Language | `Node` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm run start:prod` |
| Instance Type | **Free** |

4. **Environment Variables:**

| Key | Value |
|---|---|
| `MONGODB_URI` | tu dirección de Atlas del paso 1 (secreta) |
| `CORS_ORIGIN` | de momento `http://localhost:8080` (la cambiaremos en el paso 4) |

   No hace falta `PORT`, porque Render lo pone solo y el backend ya lo lee.

5. En **Advanced**:
   - *Health Check Path:* `/` (Render comprobará que el backend responde "Hello World!").
   - *Auto-Deploy:* **No / Off**. Quien decide cuándo desplegar será GitHub Actions.
6. Pulsa **Create Web Service** y espera a que el registro (*Logs*) diga **Live** (unos minutos la primera vez).
7. **Comprueba:** abre `https://catalogo-backend.onrender.com/productos` (con tu dirección real). Deberías ver los **3 productos de ejemplo** en JSON. El backend los crea solo al encontrar la base de datos vacía.

Apunta la dirección del backend. La necesitarás en el paso 3.

---

## 4. Paso 3 · Frontend en Render (Static Site)

1. **New +** → **Static Site** → repositorio **`DEL_CIFO`**.
2. Rellena:

| Campo | Valor |
|---|---|
| Name | `catalogo-frontend` |
| Branch | `main` |
| Root Directory | *(vacío)* |
| Build Command | `cd frontend && sh generar-config.sh` |
| Publish Directory | `frontend` |

3. **Environment Variables:**

| Key | Value |
|---|---|
| `API_URL` | la dirección del backend del paso 2, por ejemplo `https://catalogo-backend.onrender.com` |

   ¿Qué hace esto? `generar-config.sh` reescribe `config.js` con esa dirección. En local, `config.js` apunta a `http://localhost:3000`; en Render, al backend publicado. **El resto del frontend no cambia.**
4. *Auto-Deploy:* **No / Off** (en *Settings → Build & Deploy* si no aparece al crearlo).
5. **Create Static Site** y espera a **Live**. Apunta su dirección, por ejemplo `https://catalogo-frontend.onrender.com`.

---

## 5. Paso 4 · Autorizar al frontend en el backend (CORS)

El backend solo acepta peticiones del origen que indique `CORS_ORIGIN`, y de momento solo autoriza `localhost`.

1. Render → servicio **`catalogo-backend`** → **Environment**.
2. Cambia `CORS_ORIGIN` por la dirección del frontend, **sin barra final**:
   ```
   https://catalogo-frontend.onrender.com
   ```
   Si quieres seguir probando también en local con este backend, pon las dos separadas por una coma: `https://catalogo-frontend.onrender.com,http://localhost:8080`.
3. **Save, rebuild, and deploy**.

---

## 6. Paso 5 · Conectar GitHub Actions con Render (Deploy Hooks)

1. En Render → **`catalogo-backend`** → **Settings** → **Deploy Hook** → copia la dirección. Es **secreta**: quien la tenga puede lanzar despliegues.
2. Igual en **`catalogo-frontend`** → **Settings** → **Deploy Hook**.
3. En GitHub → repositorio `DEL_CIFO` → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, y crea dos:

| Name | Secret |
|---|---|
| `RENDER_DEPLOY_HOOK_BACKEND` | el Deploy Hook del backend |
| `RENDER_DEPLOY_HOOK_FRONTEND` | el Deploy Hook del frontend |

> Mientras estos secretos no existan, GitHub Actions comprueba el código pero **no despliega**: muestra un aviso amarillo en lugar de fallar.

---

## 7. Paso 6 · Primer despliegue automático

1. En GitHub → pestaña **Actions** → **Comprobar y desplegar en Render** → **Run workflow** (o haz cualquier `push` a `main`).
2. Verás tres tareas:
   - ✅ **Backend · instalar y compilar**
   - ✅ **Frontend · revisar el JavaScript**
   - ✅ **Desplegar en Render** (solo empieza si las dos anteriores están en verde)
3. En Render, en cada servicio → **Events**, aparecerá un despliegue nuevo lanzado por el Deploy Hook.

---

## 8. Paso 7 · Comprobar que todo funciona

1. Abre `https://catalogo-frontend.onrender.com/tienda.html`: el **escaparate**.
2. Abre `https://catalogo-frontend.onrender.com/`: el **panel de gestión**. Crea un producto.
3. Vuelve a la tienda y recarga: aparece el producto nuevo.
4. En Atlas → **Browse Collections** → `catalogo` → `productos`: verás el documento guardado en la nube.

Si la primera carga tarda, es normal: el backend gratuito "se duerme" (ver el apartado 10).

---

## 9. El día a día después del despliegue

```
cambias el código → git commit → git push → GitHub Actions comprueba → Render despliega
```

- Si GitHub Actions sale en **rojo** ❌, **no se publica nada**: abre la tarea roja en *Actions* y lee el error.
- Si sale en **verde** ✅, en unos minutos la web publicada tiene los cambios.

---

## 10. Limitaciones del plan gratuito

| Límite | Qué notarás |
|---|---|
| El backend **se duerme tras 15 minutos** sin visitas | La primera carga después tarda **~1 minuto**. La web muestra "Cargando productos… (puede tardar hasta 1 minuto)" |
| **750 horas gratis al mes** por cuenta (el tiempo dormido no cuenta) | Suficiente para un servicio. Si se agotan, Render lo suspende hasta el mes siguiente |
| Render puede **reiniciar** el servicio gratuito cuando quiera | No afecta a los datos, porque están en Atlas |
| Atlas M0: **512 MB** | Muy de sobra para este catálogo |

---

## 11. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Consola del navegador: *blocked by CORS policy* | `CORS_ORIGIN` no coincide exactamente con la dirección del frontend | Paso 4: dirección exacta, con `https://` y sin barra final |
| La web dice "No se puede conectar con el servidor (http://localhost:3000/…)" | El frontend publicado no recibió `API_URL` | Paso 3: revisa `API_URL` y vuelve a desplegar el frontend |
| Logs del backend: `bad auth : authentication failed` | Usuario o contraseña de Atlas incorrectos en `MONGODB_URI` | Revisa la contraseña y que no queden `< >` |
| Logs del backend: `querySrv ENOTFOUND` | Dirección de Atlas mal copiada | Vuelve a copiarla desde *Connect → Drivers* |
| Logs del backend: tiempo de espera agotado al conectar con MongoDB | Falta `0.0.0.0/0` en *Network Access* de Atlas | Paso 1, punto 4 |
| Actions: aviso amarillo "No se despliega…" | Faltan los secretos de los Deploy Hooks | Paso 5 |
| Actions: rojo en *Backend · instalar y compilar* | El código no compila | Pruébalo en local con `cd backend && npm run build` |

---

## 12. Seguridad · léelo antes de compartir la dirección

- **Nunca** subas a GitHub la `MONGODB_URI`, la contraseña de Atlas ni los Deploy Hooks. Solo van en *Environment* de Render y en *Secrets* de GitHub.
- ⚠️ **El panel de gestión no tiene inicio de sesión.** La autenticación está fuera del alcance del proyecto, así que **cualquiera que conozca la dirección del panel puede crear, editar y borrar productos**. Para clase sirve, pero:
  - comparte preferiblemente la dirección de la **tienda** (`/tienda.html`);
  - si la web va a ser pública de verdad, el siguiente paso sería añadir **autenticación** al panel y a la API.
- Atlas acepta conexiones desde cualquier IP (`0.0.0.0/0`): usa una **contraseña larga y generada**.
