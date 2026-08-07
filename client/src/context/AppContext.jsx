import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('recipeUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (user) => {
    localStorage.setItem('recipeUser', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('recipeUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
