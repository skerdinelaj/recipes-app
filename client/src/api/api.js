const BASE = '/api';

export async function getUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getRecipes() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/recipes`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function getRecipeById(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/recipes/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (res.status === 404) throw new Error('RECIPE_NOT_FOUND');
  if (!res.ok) throw new Error('Failed to fetch recipe');
  return res.json();
}

export async function getComments(recipeId) {
  const url = recipeId
    ? `${BASE}/comments?recipeId=${recipeId}`
    : `${BASE}/comments`;
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new Error('INVALID_PASSWORD');
  if (!res.ok) throw new Error('Failed to login');
  return res.json();
}
export async function createRecipe(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  return res.json();
}

export async function createComment(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  return res.json();
}

export async function createUser(data) {
  const res = await fetch(`${BASE}/auth/register`, {
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

export async function updateRecipe(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update recipe');
  return res.json();
}

export async function deleteRecipe(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete recipe');
  return res.json();
}

export async function deleteComment(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/comments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
}

export async function updateComment(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}