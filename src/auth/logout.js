import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <button onClick={handleLogout}>Se déconnecter</button>
  );
}

export default Logout;
