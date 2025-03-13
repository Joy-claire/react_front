import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AddTasks() {
  const [task, setTask] = useState({
    nom_tache: "",
    description_tache: "",
    date_debut: "",
    date_fin: "",
    statut_tache: "",
    responsable: "",
    projet: "",
  });

  const [users, setUsers] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState({
    nom_tache: "",
    description_tache: "",
    date_debut: "",
    date_fin: "",
    statut_tache: "",
    responsable: "",
  });

  const [showSubTaskForm, setShowSubTaskForm] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/utilisateurs/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      });
  }, []);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubTaskChange = (e) => {
    const { name, value } = e.target;
    setNewSubTask({ ...newSubTask, [name]: value });
  };

  const handleAddSubTask = (e) => {
    e.preventDefault();
    if (!newSubTask.nom_tache.trim() || !newSubTask.description_tache.trim()) {
      return;
    }
    setSubTasks([...subTasks, newSubTask]);
    setNewSubTask({ nom_tache: "", description_tache: "", date_debut: "", date_fin: "", statut_tache: "", responsable: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.responsable || !projectId) {
      console.error("Erreur : Le responsable ou le projet est vide.");
      return;
    }

    const formatDate = (date) => date ? new Date(date).toISOString().split("T")[0] : null;

    const newTask = {
      ...task,
      date_debut: formatDate(task.date_debut),
      date_fin: formatDate(task.date_fin),
      projet: projectId,
    };

    try {
      // Enregistrer la tâche principale
      const response = await axios.post("http://127.0.0.1:8000/api/tasks/", newTask);
      const mainTaskId = response.data.id; // Récupérer l'ID de la tâche principale

      // Enregistrer chaque sous-tâche
      for (const subTask of subTasks) {
        await axios.post("http://127.0.0.1:8000/api/tasks/", {
          ...subTask,
          date_debut: formatDate(subTask.date_debut),
          date_fin: formatDate(subTask.date_fin),
          projet: projectId,
          parent_tache: mainTaskId, // Lier la sous-tâche à la tâche principale
        });
      }

      console.log("Tâche et sous-tâches ajoutées avec succès");
      setTask({
        nom_tache: "",
        description_tache: "",
        date_debut: "",
        date_fin: "",
        statut_tache: "",
        responsable: "",
        projet: projectId,
      });
      setSubTasks([]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche ou des sous-tâches :", error.response?.data || error);
    }
  };

  return (
    <div className="container">
      <h1>Ajouter une Tâche</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {["nom_tache", "description_tache", "date_debut", "date_fin", "statut_tache", "responsable"].map((field, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <label>{field.replace("_", " ").toUpperCase()}</label>
              {field === "statut_tache" ? (
                <select className="form-control" name={field} value={task[field]} onChange={handleTaskChange} required>
                  <option value="">Sélectionner un statut</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="À faire">À faire</option>
                </select>
              ) : field === "responsable" ? (
                <select className="form-control" name={field} value={task[field]} onChange={handleTaskChange} required>
                  <option value="">Sélectionner un responsable</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.nom}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.includes("date") ? "date" : "text"}
                  className="form-control"
                  name={field}
                  value={task[field]}
                  onChange={handleTaskChange}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-success mt-3">Ajouter la tâche</button>
          <button 
            type="button" 
            className="btn btn-primary mt-3 ms-2" 
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            Terminer
          </button>
        </div>
      </form>

      {/* Bouton pour afficher le formulaire des sous-tâches */}
      <button className="btn btn-secondary mt-3" onClick={() => setShowSubTaskForm(!showSubTaskForm)}>
        {showSubTaskForm ? "Masquer" : "Ajouter une sous-tâche"}
      </button>

      {/* Formulaire des sous-tâches (affiché seulement si showSubTaskForm est true) */}
      {showSubTaskForm && (
        <div className="mt-3">
          <h3>Ajouter une sous-tâche</h3>
          <div className="row">
            {["nom_tache", "description_tache", "date_debut", "date_fin", "statut_tache", "responsable"].map((field, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <label>{field.replace("_", " ").toUpperCase()}</label>
                {field === "statut_tache" ? (
                  <select className="form-control" name={field} value={newSubTask[field]} onChange={handleSubTaskChange}>
                    <option value="">Sélectionner un statut</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="À faire">À faire</option>
                  </select>
                ) : field === "responsable" ? (
                  <select className="form-control" name={field} value={newSubTask[field]} onChange={handleSubTaskChange}>
                    <option value="">Sélectionner un responsable</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.nom}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.includes("date") ? "date" : "text"}
                    className="form-control"
                    name={field}
                    value={newSubTask[field]}
                    onChange={handleSubTaskChange}
                  />
                )}
              </div>
            ))}
            <div className="col-md-12">
              <button type="button" className="btn btn-primary mt-2" onClick={handleAddSubTask}>
                Enregistrer la sous-tâche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des sous-tâches ajoutées */}
      {subTasks.length > 0 && (
        <div>
          <h3>Sous-tâches ajoutées</h3>
          <ul className="list-group">
            {subTasks.map((subTask, index) => (
              <li key={index} className="list-group-item">
                <strong>{subTask.nom_tache}:</strong> {subTask.description_tache}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddTasks;