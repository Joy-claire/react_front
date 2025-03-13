import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

function Register() {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [role, setRole] = useState('Employe');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !nom || !password || !confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/register/', {
        email,
        nom,
        role,
        password,
      });
      
      setSuccess("Compte créé avec succès ! Vous pouvez vous connecter.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError("Erreur lors de la création du compte.");
      console.error(err);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Créer un compte</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="role" className="mt-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="Admin">Administrateur</option>
                <option value="ChefProjet">Chef de Projet</option>
                <option value="Employe">Employé</option>
              </Form.Select>
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
            <Form.Group controlId="confirmPassword" className="mt-3">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" className="w-100 mt-4" type="submit">
              S'inscrire
            </Button>
            <div className="text-center mt-3">
              <a href="/login">Déjà un compte ? Connectez-vous</a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;
