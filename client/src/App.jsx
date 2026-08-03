import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';

function ProtectedRoute({ children }) {
  const { currentUser } = useApp();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/recipes" replace /> : <LoginPage />}
        />
        <Route
          path="/recipes"
          element={<ProtectedRoute><RecipesPage /></ProtectedRoute>}
        />
        <Route
          path="/recipes/:id"
          element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>}
        />
        <Route
          path="/add-recipe"
          element={<ProtectedRoute><AddRecipePage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/recipes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
