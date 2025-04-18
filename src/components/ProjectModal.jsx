import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";

// Defines an empty project form template to easily reset the form state
// (Helps avoid ESLint warnings about dependency arrays)
const emptyForm = {
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
  clientId: "",
  userId: "",
  statusId: ""
};

export default function ProjectModal({ isOpen, initial, onClose }) {
  // Checks if we're editing an existing project or adding a new one
  const isEdit = Boolean(initial);

  // Dropdown data for clients, users, and statuses
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Form data state
  const [form, setForm] = useState(emptyForm);

  // Every time the modal opens (isOpen changes), load dropdown options
  // and set form values (either empty or prefilled if editing)
  useEffect(() => {
    if (!isOpen) return;

    // Fetch dropdown data (clients/users/statuses) from the API
    (async () => {
      try {
        const [c, u, s] = await Promise.all([
          api("/Clients").then(r => r.json()),
          api("/Users").then(r => r.json()),
          api("/Statuses").then(r => r.json())
        ]);
        setClients(c);
        setUsers(u);
        setStatuses(s);
      } catch (err) {
        console.error("Dropdown fetch failed", err);
      }
    })();

    // If editing, prefill form fields; otherwise clear the form
    if (isEdit) {
      setForm({
        projectName: initial.projectName,
        description: initial.description,
        startDate: initial.startDate.slice(0,10),
        endDate: initial.endDate?.slice(0,10) || "",
        budget: initial.budget,
        clientId: initial.client.id,
        userId: initial.user.id,
        statusId: initial.status.id
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, isEdit, initial]);

  // Updates the form state whenever any form field changes
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submits the form data (POST for adding, PUT for editing)
  const handleSubmit = async e => {
    e.preventDefault();

    // Prepare form data to send to API, ensuring correct data types
    const payload = {
      ...form,
      budget: parseFloat(form.budget),
      statusId: parseInt(form.statusId, 10)
    };
    if (isEdit) payload.id = initial.id;

    const res = await api("/Projects", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Handle API response (success or failure)
    if (!res.ok) {
      alert(`Save failed (${res.status})`);
      return;
    }

    const project = await res.json();
    // Notify parent component that project was added or updated
    onClose(project, isEdit ? "edit" : "add");
  };

  // Cancel form editing or adding
  const handleCancel = () => {
    setForm(emptyForm);
    onClose(null, "cancel");
  };

  // Don't render anything if modal isn't open
  if (!isOpen) return null;


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal title: indicates add/edit mode clearly */}
        <h2>{isEdit ? "Edit Project" : "Add Project"}</h2>

        {/* Project form: uses built-in HTML validation for required fields */}
        <form onSubmit={handleSubmit}>
          {/* Project Name (required) */}
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="Project Name"
            required
          />

          {/* Description (optional) */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />

          {/* Start Date (required) */}
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />

          {/* End Date (required, must not be before Start Date) */}
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            min={form.startDate || undefined}
            required
          />

          {/* Client selection dropdown (required) */}
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
          >
            <option value="">Select Client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.clientName}</option>
            ))}
          </select>

          {/* Owner/User selection dropdown (required) */}
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
          >
            <option value="">Select Owner</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.userName}</option>
            ))}
          </select>

          {/* Budget (required, must be between 1 and 10,000,000) */}
          <input
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
            placeholder="Budget"
            min={1}
            max={10000000}
            required
          />

          {/* Status selection dropdown (required) */}
          <select
            name="statusId"
            value={form.statusId}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {statuses.map(s => (
              <option key={s.id} value={s.id}>{s.statusName}</option>
            ))}
          </select>

          {/* Modal action buttons (Save and Cancel) */}
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
