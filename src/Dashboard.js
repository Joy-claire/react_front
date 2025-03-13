import React, { useState } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Dashboard() {
  // Données fictives pour le diagramme de Gantt
  const ganttData = [
    { name: 'Tâche 1', progress: 30 },
    { name: 'Tâche 2', progress: 70 },
    { name: 'Tâche 3', progress: 50 }
  ];

  // État pour les tâches du tableau Kanban
  const [tasks, setTasks] = useState({
    todo: [
      { id: '1', content: '🔹 Analyse des besoins' },
      { id: '2', content: '🔹 Conception UI' },
    ],
    inProgress: [
      { id: '3', content: '🔹 Développement Back-end' },
    ],
    done: [
      { id: '4', content: '✅ Installation des dépendances' },
    ],
  });

  // Fonction pour gérer le glisser-déposer
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // Si l'élément est déposé en dehors d'une zone valide
    if (!destination) return;

    // Si l'élément est déposé au même endroit
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Copie des tâches actuelles
    const newTasks = { ...tasks };
    const sourceList = newTasks[source.droppableId];
    const destinationList = newTasks[destination.droppableId];
    const [removed] = sourceList.splice(source.index, 1);

    // Ajouter la tâche à la nouvelle liste
    destinationList.splice(destination.index, 0, removed);

    // Mettre à jour l'état
    setTasks(newTasks);
  };

  // Fonction pour ajouter une nouvelle tâche
  const addTask = (columnId, content) => {
    const newTask = { id: `task-${Date.now()}`, content };
    const newTasks = { ...tasks };
    newTasks[columnId].push(newTask);
    setTasks(newTasks);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de Bord</h1>

      {/* Kanban Interactif */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <Card ref={provided.innerRef} {...provided.droppableProps}>
                  <CardContent>
                    <h2 className="font-semibold text-lg">
                      {columnId === 'todo' && 'À faire'}
                      {columnId === 'inProgress' && 'En cours'}
                      {columnId === 'done' && 'Terminé'}
                    </h2>
                    <ul>
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-2 bg-white shadow-sm rounded mb-2"
                            >
                              {task.content}
                            </li>
                          )}
                        </Draggable>
                      ))}
                    </ul>
                    {provided.placeholder}
                    {/* Bouton pour ajouter une tâche */}
                    <button
                      className="mt-2 text-sm text-blue-500 hover:text-blue-700"  
                      onClick={() => {
                        const content = prompt("Entrez le nom de la tâche :");
                        if (content) addTask(columnId, content);
                      }}
                    >
                      + Ajouter une tâche
                    </button>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Diagramme de Gantt Statique */}
      <Card>
        <CardContent>
          <h2 className="font-semibold text-lg mb-4">Diagramme de Gantt</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ganttData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="progress" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;