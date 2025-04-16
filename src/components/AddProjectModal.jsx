import React, { useEffect, useState } from 'react';

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    fetch('https://vivalpha.azurewebsites.net/api/Clients')
      .then(res => res.json())
      .then(setClients)
      .catch(err => console.error('Error fetching clients:', err));

    fetch('https://vivalpha.azurewebsites.net/api/Users')
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Error fetching users:', err));

    fetch('https://vivalpha.azurewebsites.net/api/Statuses')
      .then(res => res.json())
      .then(setStatuses)
      .catch(err => console.error('Error fetching statuses:', err));
  }, [isOpen]);

  console.log('Clients:', clients);
    console.log('Users:', users);
    console.log('Statuses:', statuses);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      projectName: e.target.projectName.value,
      description: e.target.description.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
      clientId: e.target.clientId.value,
      userId: e.target.ownerId.value,
      budget: parseFloat(e.target.budget.value),
      statusId: e.target.statusId.value
    };

    try {
      const response = await fetch('https://vivalpha.azurewebsites.net/api/Projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });

      if (response.ok) {
        const createdProject = await response.json();
        onSubmit(createdProject); // Update state in parent
        onClose();
      } else {
        console.error('Failed to add project');
      }
    } catch (err) {
      console.error('Error posting project:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Project</h2>
        <form onSubmit={handleSubmit}>
          <input name="projectName" placeholder="Project Name" required />

          <select name="clientId" required>
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.clientName}
              </option>
            ))}
          </select>

          <textarea name="description" placeholder="Description" required />

          <input name="startDate" type="date" required />
          <input name="endDate" type="date" required />

          <select name="ownerId" required>
            <option value="">Select Project Owner</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.userName}
              </option>
            ))}
          </select>

          <input name="budget" type="number" placeholder="Budget" required />

          <select name="statusId" required>
            <option value="">Select Status</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.statusName}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
