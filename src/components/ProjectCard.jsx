import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h4 className="h4">{project.projectName}</h4>
      <p>{project.description}</p>
      <p>
        <strong>Start:</strong>{' '}
        {new Date(project.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>End:</strong>{' '}
        {new Date(project.endDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProjectCard;
