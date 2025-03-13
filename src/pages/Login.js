import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        email,  
        password,
      });
  
      console.log("✅ Réponse complète du serveur :", response.data);
  
      const { access, refresh, role } = response.data;
  
      if (!role) {
        console.error("❌ Problème : Aucun rôle reçu !");
        setError("Erreur d'authentification. Veuillez réessayer.");
        return;
      }
  
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', role);
  
      console.log("🎯 Stocké dans localStorage :", {
        access: localStorage.getItem('accessToken'),
        refresh: localStorage.getItem('refreshToken'),
        role: localStorage.getItem('userRole')
      });
  
      if (role === 'Admin') {
        navigate('/list');  
      } else if (role === 'ChefProjet') {
        navigate('/projects');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Erreur de connexion. Vérifiez vos identifiants.");
      console.error("❌ Erreur Axios :", err);
    }
  };
  

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" className="w-100 mt-4" type="submit">
              Se connecter
            </Button>
          </Form>
          <div className="text-center mt-3">
            <a href="/register">Créer un compte</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
