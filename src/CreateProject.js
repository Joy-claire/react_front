import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const [nomProjet, setNomProjet] = useState("");
  const [descriptionProjet, setDescriptionProjet] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [budget, setBudget] = useState("");
  const [statutProjet, setStatutProjet] = useState("");
  const [directions, setDirections] = useState([]);
  const [directionId, setDirectionId] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chefProjetId, setChefProjetId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Charger les directions et les utilisateurs depuis l'API
  useEffect(() => {
    // Charger les directions
    axios.get("http://127.0.0.1:8000/api/directions/")
      .then(response => setDirections(response.data))
      .catch(error => console.error("Erreur chargement directions :", error));

    // Charger les utilisateurs (chefs de projet)
    axios.get("http://127.0.0.1:8000/api/utilisateurs/")
      .then(response => setUtilisateurs(response.data))
      .catch(error => console.error("Erreur chargement utilisateurs :", error));
  }, []);

  // Envoyer le projet au back-end Django
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!budget || isNaN(budget)) {
      setMessage("Le budget doit être un nombre valide");
      return;
    }
  
    const statutMap = {
      "en_cours": "En cours",
      "termine": "Terminé",
      "annule": "Annulé",
      "en_attente":"En attente"
  };

    const projetData = {
      nom_projet: nomProjet,
      description_projet: descriptionProjet,
      date_debut: dateDebut,
      date_fin: dateFin,
      budget: budget ? parseFloat(budget) : null,
      statut_projet: statutMap[statutProjet] || statutProjet ,     
      direction: parseInt(directionId, 10), 
      chef_projet: parseInt(chefProjetId, 10)
    };
  
    console.log("Données envoyées :", projetData);
  
    axios.post("http://127.0.0.1:8000/api/projects/", projetData)
      .then(() => {
        setMessage("Projet créé avec succès !");
        resetForm();
      })
      .catch(error => {
        console.error("Erreur lors de la création du projet :", error);
        if (error.response) {
          console.log("Réponse du serveur :", error.response.data);
          setMessage(`Erreur : ${JSON.stringify(error.response.data)}`);
        }
      });
  };
  
  
  

  const resetForm = () => {
    setNomProjet("");
    setDescriptionProjet("");
    setDirectionId("");
    setDateDebut("");
    setDateFin("");
    setBudget("");
    setStatutProjet("");
    setChefProjetId("");
  };

  return (
    <div className="container">
      <h1>Créer un Projet</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Nom du Projet */}
        <div className="mb-3">
          <label className="form-label">Nom du Projet</label>
          <input type="text" className="form-control" value={nomProjet} onChange={e => setNomProjet(e.target.value)} required />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={descriptionProjet} onChange={e => setDescriptionProjet(e.target.value)} required />
        </div>

        {/* Direction (Liste déroulante) */}
        <div className="mb-3">
          <label className="form-label">Direction</label>
          <select className="form-control" value={directionId} onChange={e => setDirectionId(e.target.value)} required>
            <option value="">Sélectionner une direction</option>
            {directions.map(dir => (
              <option key={dir.id} value={dir.id}>{dir.nom_direction}</option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="mb-3">
          <label className="form-label">Date de Début</label>
          <input type="date" className="form-control" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Date de Fin</label>
          <input type="date" className="form-control" value={dateFin} onChange={e => setDateFin(e.target.value)} required />
        </div>

        {/* Budget */}
        <div className="mb-3">
          <label className="form-label">Budget</label>
          <input type="number" step="0.01" className="form-control" value={budget} onChange={e => setBudget(e.target.value)} required />
        </div>

        {/* Statut du Projet */}
        <div className="mb-3">
          <label className="form-label">Statut</label>
          <select
            className="form-control"
            value={statutProjet} 
            onChange={e => setStatutProjet(e.target.value)} 
            required
          >
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
                <option value="En attente">En attente</option>


          </select>
        </div>

        {/* Chef de Projet (Liste déroulante) */}
        <div className="mb-3">
          <label className="form-label">Chef de Projet</label>
          <select className="form-control" value={chefProjetId} onChange={e => setChefProjetId(e.target.value)} required>
            <option value="">Sélectionner un chef de projet</option>
            {utilisateurs.map(user => (
              <option key={user.id} value={user.id}>{user.nom} ({user.email})</option>
            ))}
          </select>
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="btn btn-primary">Créer</button>
      </form>

      <button className="btn btn-success mb-3" onClick={() => navigate("/list/")}>
        Retour
      </button>
    </div>
  );
}

export default CreateProject;
