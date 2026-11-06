import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import LoginPage from './LoginPage';
import { loginUser, createUser } from '../api/api';

// Replace the real API calls with fakes, so tests never hit a backend.
vi.mock('../api/api', () => ({
  loginUser: vi.fn(),
  createUser: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recipes" element={<h1>Recipes page</h1>} />
        </Routes>
      </MemoryRouter>
    </AppProvider>
  );
}

const fakeUser = { name: 'Test', surname: 'User', email: 'test@example.com', token: 'fake-token' };

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the login form by default', () => {
    renderLoginPage();

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('First name')).not.toBeInTheDocument();
  });

  it('shows name fields after switching to the Sign up tab', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('logs in, saves the token and goes to the recipes page', async () => {
    loginUser.mockResolvedValue(fakeUser);
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123{Enter}');

    expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(await screen.findByText('Recipes page')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('shows an error and stays on the page when login fails', async () => {
    loginUser.mockRejectedValue(new Error('INVALID_PASSWORD'));
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByPlaceholderText('Email address'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong{Enter}');

    expect(await screen.findByText('INVALID_PASSWORD')).toBeInTheDocument();
    expect(screen.queryByText('Recipes page')).not.toBeInTheDocument();
  });

  it('signs up with trimmed name and lowercase email', async () => {
    createUser.mockResolvedValue(fakeUser);
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    await user.type(screen.getByPlaceholderText('First name'), '  Test ');
    await user.type(screen.getByPlaceholderText('Last name'), 'User');
    await user.type(screen.getByPlaceholderText('Email address'), 'Test@Example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(createUser).toHaveBeenCalledWith({
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(await screen.findByText('Recipes page')).toBeInTheDocument();
  });
});
