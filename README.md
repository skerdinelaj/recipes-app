# RecipeBook

A full-stack recipe sharing app. Users register, log in, create and browse recipes, and comment on each other's recipes.

- **Live app:** https://recipes-app-skerdi.vercel.app
- **Live API:** https://recipes-app-aial.onrender.com

> The API is hosted on Render's free tier, so the first request after a period of inactivity can take up to a minute while the instance spins up.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19, React Router, Vite, Tailwind CSS |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Testing | Jest + Supertest |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Project structure

```
recipes-app/
├── backend/                 # Express API — see backend/Readme.md
│   ├── app.js                # Express app: routes, middleware (exported for testing)
│   ├── server.js              # entry point — connects to MongoDB, starts the HTTP server
│   ├── models/                # Mongoose schemas: User, Recipe, Comment
│   ├── middleware/             # auth (JWT check), asyncHandler, errorHandler
│   ├── validation/             # Zod schemas for auth/recipe/comment payloads
│   └── test/                    # Jest + Supertest test suite
│
└── client/                  # React frontend (Vite) — see client/README.md
    └── src/
        ├── api/                # fetch wrappers around the backend API
        ├── context/             # AppContext — current user/session state
        ├── components/          # Navbar, RecipeCard
        └── pages/               # LoginPage, RecipesPage, RecipeDetailPage, AddRecipePage
```

## Features

- JWT-based authentication with bcrypt password hashing
- Full CRUD for recipes and comments, with ownership enforcement (users can only edit/delete their own content)
- Search, category filtering, sorting, and pagination on the recipe list
- Aggregation endpoint for recipe counts by category
- Centralized input validation (Zod) and error handling
- Automated backend test suite (Jest + Supertest)

## Running locally

Each half of the app has its own setup instructions:

- [`backend/Readme.md`](./backend/Readme.md) — API setup, environment variables, running tests
- [`client/README.md`](./client/README.md) — frontend setup, environment variables, available scripts

In short:

```bash
# backend
cd backend
npm install
npm start        # runs on the PORT set in backend/.env

# frontend, in a separate terminal
cd client
npm install
npm run dev       # runs on http://localhost:5173
```

The frontend talks to the backend via `VITE_API_URL` (see `client/.env`); in dev it defaults to `http://localhost:3000` and requests to `/api` are also proxied there by Vite.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for how the app is deployed (Vercel + Render + MongoDB Atlas) and how to redeploy or reproduce the setup.

## API overview

Full endpoint reference lives in [`backend/Readme.md`](./backend/Readme.md#api-overview). Base URL for the live API: `https://recipes-app-aial.onrender.com/api`.
