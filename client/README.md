# RecipeBook — Frontend

The React (Vite) frontend for [RecipeBook](../README.md), a full-stack recipe sharing app.

- **Live app:** https://recipes-app-skerdi.vercel.app
- **Live API it talks to:** https://recipes-app-aial.onrender.com

## Tech stack

- React 19 + React Router 7
- Vite
- Tailwind CSS
- Plain `fetch` for API calls (see `src/api/api.js`), no extra data-fetching library

## Project structure

```
client/
├── src/
│   ├── main.jsx            # app entry point
│   ├── App.jsx              # routes: /login, /recipes, /recipes/:id, /add-recipe
│   ├── api/
│   │   └── api.js            # fetch wrappers for every backend endpoint
│   ├── context/
│   │   └── AppContext.jsx     # current-user/session state, shared via context
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── RecipeCard.jsx
│   └── pages/
│       ├── LoginPage.jsx
│       ├── RecipesPage.jsx     # search, category filter, sort, pagination
│       ├── RecipeDetailPage.jsx # recipe detail + comments
│       └── AddRecipePage.jsx
└── vite.config.js           # dev server proxy: /api -> http://localhost:3000
```

## Getting started

### Prerequisites
- Node.js (v18+)
- The backend running locally (see [`../backend/Readme.md`](../backend/Readme.md)), or the live API

### Setup

```bash
cd client
npm install
```

Create a `.env` file in `client/`:
```
VITE_API_URL=http://localhost:3000
```

To point the frontend at the live API instead of a local backend, set `VITE_API_URL=https://recipes-app-aial.onrender.com`.

Run the dev server:
```bash
npm run dev
```

The app runs at `http://localhost:5173`. In dev, requests to `/api` are also proxied to `http://localhost:3000` by Vite (see `vite.config.js`), but `src/api/api.js` builds its base URL from `VITE_API_URL` directly.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` / `npm start` | Start the Vite dev server |
| `npm run build` | Type/production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Features

- Login / register against the backend, with the JWT stored in `localStorage`
- Protected routes — unauthenticated users are redirected to `/login`
- Browse recipes with search, category filter, sort (newest/oldest), and pagination
- View a single recipe with its comments; add, edit, and delete your own recipes and comments
- Create new recipes

## Deployment

This frontend is deployed on Vercel. See [`../DEPLOYMENT.md`](../DEPLOYMENT.md) for environment variables and deploy steps.
