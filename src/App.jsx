import React, { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7242/api/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, [])
  return (
    <>
      <h3>Alpha Project</h3>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h4>{project.projectName}</h4>
            <p>{project.description}</p>
            <p>Start Date: {project.startDate}</p>
            <p>End Date: {project.endDate}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
