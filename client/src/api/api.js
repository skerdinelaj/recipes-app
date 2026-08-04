const BASE = '/api';

export async function getUsers() {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getRecipes() {
  const res = await fetch(`${BASE}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function getRecipeById(id) {
  const res = await fetch(`${BASE}/recipes/${id}`);
  if (res.status === 404) throw new Error('RECIPE_NOT_FOUND');
  if (!res.ok) throw new Error('Failed to fetch recipe');
  return res.json();
}

export async function getComments(recipeId) {
  const url = recipeId
    ? `${BASE}/comments?recipeId=${recipeId}`
    : `${BASE}/comments`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function createRecipe(data) {
  const res = await fetch(`${BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  return res.json();
}

export async function createComment(data) {
  const res = await fetch(`${BASE}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  return res.json();
}

export async function createUser(data) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create user');
  }
  return res.json();
}
