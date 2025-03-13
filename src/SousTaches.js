import { useState } from "react";

function SousTaches({ parentTacheId }) {
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            nom_tache: nom,
            description_tache: description,
            date_debut: dateDebut,
            date_fin: dateFin,
            parent_tache: parentTacheId
        };

        try {
            const response = await fetch(`/api/tasks/${parentTacheId}/ajouter_sous_tache/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setMessage("Sous-tâche ajoutée avec succès !");
                setNom(""); setDescription(""); setDateDebut(""); setDateFin("");
            } else {
                setMessage("Erreur lors de l'ajout.");
            }
        } catch (error) {
            setMessage("Problème de connexion au serveur.");
        }
    };

    return (
        <div>
            <h3>Ajouter une sous-tâche</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
                <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
                <button type="submit">Ajouter</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SousTaches;
