
import React from "react";

export default function ViewProjectModal({ isOpen, project, onClose }) {
  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content view">
        <h2>{project.projectName}</h2>

        <p><strong>Description:</strong><br/>{project.description}</p>

        <p>
          <strong>Client:</strong> {project.client.clientName}<br/>
          <strong>Owner:</strong>  {project.user.userName}<br/>
          <strong>Status:</strong> {project.status.statusName}
        </p>

        <p>
          <strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}<br/>
          <strong>End:</strong>   {new Date(project.endDate).toLocaleDateString()}<br/>
          <strong>Budget:</strong> ${project.budget.toLocaleString()}
        </p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
