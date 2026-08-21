# Deployment

RecipeBook is deployed as three separate pieces:

| Piece | Platform | URL |
|---|---|---|
| Frontend (`client/`) | Vercel | https://recipes-app-skerdi.vercel.app |
| Backend (`backend/`) | Render | https://recipes-app-aial.onrender.com |
| Database | MongoDB Atlas | — |

## Backend — Render

The API is deployed as a Render **Web Service**, built directly from the `backend/` directory of this repo.

**Settings:**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start` (runs `node server.js`)

**Environment variables** (Render dashboard → Environment):

| Variable | Description |
|---|---|
| `MONGODB_URI` | Connection string for the production MongoDB Atlas cluster/database |
| `JWT_SECRET` | Secret used to sign/verify JWTs — must stay constant across deploys or existing tokens become invalid |
| `PORT` | Render provides this automatically; `server.js` reads `process.env.PORT` |

Render's free tier spins the instance down after a period of inactivity, so the first request after idle time can take up to ~60 seconds while it cold-starts.

To redeploy: push to the branch Render is watching (or trigger a manual deploy from the Render dashboard). Render rebuilds and restarts the service automatically.

## Frontend — Vercel

The frontend is deployed as a Vercel project built from the `client/` directory.

**Settings:**
- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

**Environment variables** (Vercel dashboard → Settings → Environment Variables):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend — `https://recipes-app-aial.onrender.com` |

Vite only reads `VITE_*` env vars at build time, so changing `VITE_API_URL` requires a new deployment (redeploy from the Vercel dashboard, or push a commit) to take effect.

To redeploy: push to the branch Vercel is watching, or trigger a redeploy from the Vercel dashboard.

## Database — MongoDB Atlas

A MongoDB Atlas cluster hosts the production database referenced by the backend's `MONGODB_URI`. The backend's test suite (`backend/test/`) is designed to run against a **separate** database — set via `MONGODB_URI` in `backend/.env.test` — so tests never touch production data.

Atlas Network Access must allow connections from Render's outbound IPs (or `0.0.0.0/0` if using IP allowlisting isn't practical on the current Atlas tier).

## Redeploying / reproducing this setup from scratch

1. Create a MongoDB Atlas cluster and database user; get the connection string.
2. Create a Render Web Service pointed at this repo with root directory `backend`, and set `MONGODB_URI` / `JWT_SECRET` as above.
3. Create a Vercel project pointed at this repo with root directory `client`, and set `VITE_API_URL` to the Render service's URL.
4. Confirm CORS: the backend uses `cors()` with no origin restriction (see `backend/app.js`), so no extra config is needed for Vercel to call it.
