import React, { useEffect, useRef, useState } from "react";
import { api } from "../helpers/api";

export default function ProjectModal({ isOpen, initial, onClose }) {
  // ProjectModal handles both adding and editing a project
  // If there's an initial project then this is an edit form
  // Switched to using the new react 19 form handler style
  const isEditing = Boolean(initial);

  // These hold the dropdown options for select fields
  const [clients, setClients] = useState([]);
  const [owners, setOwners] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Ref to the form element, using this to access fields directly, need for date validation
  const formRef = useRef(null);

  // When the modal opens, fetch data for the dropdowns
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const [clientData, ownerData, statusData] = await Promise.all([
          api("/Clients").then(res => res.json()),
          api("/Users").then(res => res.json()),
          api("/Statuses").then(res => res.json())
        ]);

        setClients(clientData);
        setOwners(ownerData);
        setStatuses(statusData);
      } catch (error) {
        console.error("Dropdown fetch failed:", error);
      }
    })();
  }, [isOpen]);

  // new form handler style for React 19
  async function handleFormSubmit(formData) {
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    // Just a simple check to make sure endDate isn’t before startDate
    if (startDate && endDate && endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    const projectData = {
      projectName: formData.get("projectName"),
      description: formData.get("description"),
      startDate,
      endDate,
      budget: parseFloat(formData.get("budget")),
      clientId: formData.get("clientId"),
      userId: formData.get("userId"),
      statusId: parseInt(formData.get("statusId"), 10),
    };

    // if we're editing we need to add the project ID to the data
    if (isEditing) {
      projectData.id = initial.id;
    }

    // Send to the API PUT OR POST
    const response = await api("/Projects", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      alert(`Save failed (${response.status})`);
      return;
    }

    const savedProject = await response.json();
    // Tell the parent we’re done, and what kind of action it was
    onClose(savedProject, isEditing ? "edit" : "add");
  }

  // If Cancel is clicked, just close the modal without saving anything
  const handleCancel = () => {
    onClose(null, "cancel");
  };

  // This keeps the end date from being set earlier than the start date
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (formRef.current) {
      const endDateInput = formRef.current.querySelector("input[name='endDate']");
      if (endDateInput) {
        endDateInput.min = newStartDate;
      }
    }
  };

  // Only show this modal if it’s open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "Edit Project" : "Add Project"}</h2>

        {/* no need for onSubmit or preventDefault with new react19 forms*/}
        <form ref={formRef} action={handleFormSubmit}>
          {/* Project name */}
          <input
            name="projectName"
            defaultValue={initial?.projectName || ""}
            placeholder="Project Name"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            defaultValue={initial?.description || ""}
            placeholder="Description"
          />

          {/* Start date */}
          <input
            type="date"
            name="startDate"
            defaultValue={initial?.startDate?.slice(0, 10) || ""}
            onChange={handleStartDateChange}
            required
          />

          {/* End date */}
          <input
            type="date"
            name="endDate"
            defaultValue={initial?.endDate?.slice(0, 10) || ""}
            required
          />

          {/* Client select */}
          <select name="clientId" defaultValue={initial?.client?.id || ""} required>
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.clientName}
              </option>
            ))}
          </select>

          {/* Owner select */}
          <select name="userId" defaultValue={initial?.user?.id || ""} required>
            <option value="">Select Owner</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.userName}
              </option>
            ))}
          </select>

          {/* Budget */}
          <input
            name="budget"
            type="number"
            defaultValue={initial?.budget || ""}
            placeholder="Budget"
            min={1}
            max={10000000}
            required
          />

          {/* Status select */}
          <select name="statusId" defaultValue={initial?.status?.id || ""} required>
            <option value="">Select Status</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.statusName}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
