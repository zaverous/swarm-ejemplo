import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Lazy load de las páginas para mejorar el rendimiento
const Login = lazy(() => import('./pages/Login/Login'));
const Chat = lazy(() => import('./pages/Chat/Chat'));
const ProfileUpdate = lazy(() => import('./pages/ProfileUpdate/ProfileUpdate'));

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Obtener el token almacenado
  return token ? children : <Navigate to="/" />; // Redirigir a la página de login si no hay token
};

const App = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileUpdate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
