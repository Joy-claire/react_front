import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 

function ProjectDetail() {
  const [project, setProject] = useState(null);
  const { id_projets } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/projects/${id_projets}/`)
      .then(response => setProject(response.data))
      .catch(error => console.error("Erreur lors du chargement du projet :", error));
  }, [id_projets]);

  if (!project) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Détails du projet: {project.nom_projet}</h1>
      <p><strong>Description:</strong> {project.description_projet}</p>
      <p><strong>Date de début:</strong> {project.date_debut}</p>
      <p><strong>Date de fin:</strong> {project.date_fin}</p>
      <p><strong>Budget:</strong> {project.budget}</p>
      <p><strong>Statut:</strong> {project.statut_projet}</p>
      <p><strong>Chef de projet:</strong> {project.chef_projet ? project.chef_projet.nom : 'Aucun'}</p>
      
      {/* Ajout du nombre de tâches */}
      <p><strong>Nombre de tâches principales:</strong> {project.nombre_taches}</p>
      <p><strong>Nombre de sous-tâches:</strong> {project.nombre_sous_taches}</p>

      <button className="btn btn-warning" onClick={() => navigate(`/projects/${project.id}/edit`)}>
        Modifier
      </button>

      <button className="btn btn-success mb-3" onClick={() => navigate("/list/")}>
        Retour
      </button>
    </div>
  );
}

export default ProjectDetail;
