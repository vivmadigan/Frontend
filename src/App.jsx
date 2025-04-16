import React, { useEffect, useState } from 'react';
import './App.css';
import PortalLayout from './layouts/PortalLayout';
import ProjectCard from './components/ProjectCard'; // Make sure this file exists
import AddProjectModal from './components/AddProjectModal'; // Make sure this file exists

function App() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility

  useEffect(() => {
    fetch('https://vivalpha.azurewebsites.net/api/Projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
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
