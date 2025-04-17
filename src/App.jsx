import React, { useEffect, useState } from 'react';
import './App.css';
import PortalLayout from './layouts/PortalLayout';
import ProjectCard from './components/ProjectCard'; 
import AddProjectModal from './components/AddProjectModal'; 
import { api } from './helpers/api'; 

function App() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility

  useEffect(() => {
    api('/Projects')
       .then(res => res.json())
       .then(setProjects)
       .catch(err => console.error('Error fetching projects', err))
  }, []);

  const handleAddProject = (newProject) => {
    setProjects(prev => [...prev, newProject]);
  };

  return (
    <PortalLayout>
      <section>
        <header className="page-header">
          <h2 className="h2">Projects</h2>
            <button className="btn btn-add" onClick={() => setShowModal(true)}>
              <span>Add Project</span>
            </button>
        </header>

        <section id="projects">
          <div >
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </section>

      <AddProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddProject}
      />
    </PortalLayout>
  );
}

export default App;
