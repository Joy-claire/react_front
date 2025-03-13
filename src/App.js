import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import AddTasks from "./AddTasks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./Dashboard"; 
import Projects from "./pages/projects";  
import SousTaches from "./SousTaches"; // ✅ Correction de l'import

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique */}
        <Route path="" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées */}
        <Route path="/list" element={<PrivateRoute element={<ProjectList />} />} />
        <Route path="/sous" element={<PrivateRoute element={<SousTaches />} />} /> {/* ✅ Correction de l'élément */}
        <Route path="/addproject" element={<PrivateRoute element={<CreateProject />} />} />
        <Route path="/projects/:id_projets/edit" element={<PrivateRoute element={<EditProject />} />} />
        <Route path="/projects/:id_projets" element={<PrivateRoute element={<ProjectDetail />} />} />
        <Route path="/projects/:projectId/tasks/add" element={<PrivateRoute element={<AddTasks />} />} />

        {/* Accès pour les utilisateurs standard */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} /*allowedRoles={['Admin', 'chef_projet', 'utilisateur']}  */ />} />

        {/* ✅ Ajout de la route /projects pour le chef de projet */}
        <Route path="/projects" element={<PrivateRoute element={<Projects />} />} />
      </Routes>
    </Router>
  );
}

export default App;
