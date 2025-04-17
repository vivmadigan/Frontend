import React, { useEffect, useState } from 'react';
import {api} from '../helpers/api';

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
        try {
          const [c, u, s] = await Promise.all([
            api('/Clients').then(r => r.json()),
            api('/Users').then(r => r.json()),
            api('/Statuses').then(r => r.json()),
          ]);
          setClients(c);
          setUsers(u);
          setStatuses(s);
        } catch (err) {
          console.error('Error pre‑loading dropdowns', err);
        }
      })();
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
        const res = await api('/Projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject),
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const created = await res.json();
    
          onSubmit(created);       // lift to parent
          onClose();               // close modal
        } catch (err) {
          console.error('Error posting project:', err);
          alert('Failed to add project');
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
