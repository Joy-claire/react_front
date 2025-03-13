import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/projects/")
      .then(response => setProjects(response.data))
      .catch(error => console.error("Erreur lors du chargement des projets :", error));
  }, []);

  const handleDelete = (id) => {
    if (!id) {
      console.error("ID du projet manquant !");
      return;
    }
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`)
        .then(() => setProjects(projects.filter(project => project.id_projets !== id)))
        .catch(error => console.error("Erreur lors de la suppression :", error));
    }
  };

  return (
    <div className="container">
      <h1>Liste des Projets</h1>
      
      <button className="btn btn-success mb-3" onClick={() => navigate("/addproject/")}>Créer un projet</button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Budget</th>
            <th>Statut</th>
            <th>Chef de projet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id || project.id}>
              <td>{project.id}</td>
              <td>{project.nom_projet}</td>
              <td>{project.description_projet}</td>
              <td>{project.date_debut}</td>
              <td>{project.date_fin}</td>
              <td>{project.budget}</td>
              <td>{project.statut_projet}</td>
              <td>{project.chef_projet ? project.chef_projet.nom : "Aucun"}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => navigate(`/projects/${project.id}`)}>Afficher</button>
                <button className="btn btn-warning btn-sm" onClick={() => navigate(`/projects/${project.id}/edit`)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project.id)}>Supprimer</button>
                <button className="btn btn-info btn-sm" onClick={() => navigate(`/projects/${project.id}/tasks/add`)}>Ajout Tâches</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectList;
