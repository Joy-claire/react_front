import React, { useEffect, useState } from "react";
import { api } from "../auth";  // Importer l'API configurée

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects/")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des projets", error));
  }, []);

  return (
    <div>
      <h1>Liste des Projets</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
