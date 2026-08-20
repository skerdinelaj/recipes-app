# RecipeBook

A full-stack recipe sharing app with auth. Users can register, log in, create and share recipes, and comment on each other's recipes.

**Live demo:** https://recipes-app-aial.onrender.com/api/recipes

## Features

- JWT-based authentication with bcrypt password hashing
- Full CRUD for recipes and comments, with ownership enforcement (users can only edit/delete their own content)
- Search, category filtering, sorting, and pagination on the recipe list
- Aggregation endpoint for recipe counts by category
- Input validation (zod) and centralized error handling
- Automated test suite (Jest + Supertest) covering auth and protected routes

## Tech stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, zod, Jest, Supertest
**Frontend:** React, Vite, Tailwind CSS

## Project structure

```
recipes-app/
├── backend/          # Express API
│   ├── models/        # Mongoose schemas (User, Recipe, Comment)
│   ├── middleware/     # auth, error handling, async wrapper
│   ├── validation/    # zod schemas
│   ├── test/           # Jest + Supertest test suite
│   ├── app.js          # Express app (exported, testable)
│   └── server.js        # entry point — connects to DB and starts the server
└── client/            # React frontend (Vite)
```

## Getting started

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Run the server:
```bash
node server.js
```

### Frontend setup

```bash
cd client
npm install
npm run dev
```

The frontend expects the backend running on `http://localhost:3000` (configured via Vite's dev server proxy).

### Running tests

```bash
cd backend
npm install --save-dev dotenv-cli   # if not already installed
```

Create a `.env.test` file in `backend/` pointing to a separate test database:
```
MONGODB_URI=your_mongodb_connection_string_with_a_different_db_name
JWT_SECRET=your_jwt_secret
```

```bash
npm test
```

## API overview

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |
| GET | `/api/recipes` | List recipes (supports `category`, `userId`, `search`, `sort`, `page`, `limit` query params) | Yes |
| GET | `/api/recipes/stats/by-category` | Recipe counts grouped by category | Yes |
| GET | `/api/recipes/:id` | Get a single recipe | Yes |
| POST | `/api/recipes` | Create a recipe | Yes |
| PATCH | `/api/recipes/:id` | Update a recipe (owner only) | Yes |
| DELETE | `/api/recipes/:id` | Delete a recipe (owner only) | Yes |
| GET | `/api/comments` | List comments (supports `recipeId` query param) | Yes |
| POST | `/api/comments` | Create a comment | Yes |
| PUT | `/api/comments/:id` | Update a comment (owner only) | Yes |
| DELETE | `/api/comments/:id` | Delete a comment (owner only) | Yes |

## What I learned building this

This project was built as a hands-on way to learn the MERN stack backend — Node, Express, and MongoDB — from the ground up, including authentication (bcrypt + JWT), authorization/ownership enforcement, input validation, centralized error handling, aggregation pipelines, and automated testing.