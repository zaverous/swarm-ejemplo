import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Lazy load de las páginas para mejorar el rendimiento
const Login = lazy(() => import('./pages/Login/Login'));
const Chat = lazy(() => import('./pages/Chat/Chat'));
//const ProfileUpdate = lazy(() => import('./pages/ProfileUpdate/ProfileUpdate'));

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Obtener el token almacenado
  return token ? children : <Navigate to="/" />; // Redirigir a la página de login si no hay token
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Chat" element={<Chat />} />
      <Route path="/Chat/:chatId" element={<Chat />} /> {/* Ruta con chatId */}
      {/* <Route path="/profile" element={<ProfileUpdate />} /> */}
    </Routes>
  );
};

export default App;
