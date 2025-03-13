import React from 'react';
import { Navigate } from 'react-router-dom';

// Fonction pour récupérer le rôle et le token de l'utilisateur
const getUserRole = () => localStorage.getItem('userRole');
const getToken = () => localStorage.getItem('accessToken');

const PrivateRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  const token = getToken();

  // 🔴 Si aucun rôle n'est requis → autoriser l'accès
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log("✅ Aucune restriction de rôle, accès autorisé");
    return element;
  }

  // 🔴 Si aucun token, l'utilisateur n'est pas connecté → redirection vers /login
  if (!token) {
    console.log("🔴 Aucun token, redirection vers /login");
    return <Navigate to="/login" />;
  }

  // 🔴 Si l'utilisateur n'a pas le bon rôle → redirection vers /dashboard
  if (!allowedRoles.includes(role)) {
    console.log("🟠 Rôle non autorisé, redirection vers /dashboard");
    return <Navigate to="/dashboard" />;
  }

  // ✅ L'utilisateur a le bon rôle → afficher la page demandée
  return element;
};

// ✅ Exportation par défaut
export default PrivateRoute;
