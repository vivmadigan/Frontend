import React, { useEffect, useState } from 'react';
import './App.css';
import PortalLayout from './layouts/PortalLayout';
import ProjectCard from './components/ProjectCard'; // Make sure this file exists

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7242/api/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  return (
    <PortalLayout>
      <section>
        <header className="page-header">
          <h2 className="h2">Projects</h2>
          <button className="btn btn-add">
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
    </PortalLayout>
  );
}

export default App;
