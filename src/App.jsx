// src/App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";

import PortalLayout      from "./layouts/PortalLayout";
import ProjectCard       from "./components/ProjectCard";
import ProjectModal      from "./components/ProjectModal";
import ViewProjectModal  from "./components/ViewProjectModal";
import { api }           from "./helpers/api";

export default function App() {

  // Stores all projects fetched from the API
  const [projects, setProjects] = useState([]);

  // Tracks the currently selected tab ("all" or "completed")
  const [tab, setTab] = useState("all");

  // Controls the visibility of the add/edit project modal
  const [modalOpen, setModalOpen] = useState(false);

  // Keeps track of which project I'm editing (null means adding a new project)
  const [editing, setEditing] = useState(null);

  // Holds the project details for viewing (null means no project selected)
  const [viewing, setViewing] = useState(null);

  // When the component first mounts, fetch the projects from the API
  useEffect(() => {
    api("/Projects")
      .then(r => r.json())
      // Sort fetched projects so newest ones appear first
      .then(data =>
        data.sort((a, b) => new Date(b.created) - new Date(a.created))
      )
      .then(setProjects)
      .catch(err => console.error("Project fetch failed", err));
  }, []); // Runs only once on component mount

  // Filter projects based on the selected tab
  const visible = projects.filter(p =>
    tab === "all" ? true : p.status.statusName === "Completed"
  );

  // Opens modal to ADD a new project (clears editing state)
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // Opens modal to EDIT an existing project
  const openEdit = (proj) => {
    setEditing(proj);
    setModalOpen(true);
  };

  // Opens the modal to VIEW a project's details
  const openView = (proj) => setViewing(proj);

  // Closes the view modal
  const closeView = () => setViewing(null);

  // Handles project deletion after user confirms
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    const res = await api(`/Projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      // Remove the deleted project from local state
      setProjects(p => p.filter(pr => pr.id !== id));
    } else {
      alert(`Delete failed (${res.status})`);
    }
  };

  // Handles the modal closing event, updating state based on action
  // proj = the newly created or updated project (null if cancelled)
  // mode = "add" | "edit" | "cancel"
  const handleModalClose = (proj, mode) => {
    setModalOpen(false);
    if (!proj) return; // User cancelled, nothing to update

    setProjects(p => {
      if (mode === "add") return [...p, proj];
      if (mode === "edit") return p.map(x => x.id === proj.id ? proj : x);
      return p;
    });
  };

  // Main JSX for rendering the app layout
  return (
    <PortalLayout>

      {/* Page header with the title and "Add Project" button */}
      <header className="page-header">
        <h2 className="h2">Projects</h2>
        <button className="btn btn-add" onClick={openAdd}>
          Add Project
        </button>
      </header>

      {/* Tabs to filter projects ("All" and "Completed") */}
      <nav className="tabs tab-bar">
        <button
          className={tab === "all" ? "tab active" : "tab"}
          onClick={() => setTab("all")}
        >
          ALL ({projects.length})
        </button>

        <button
          className={tab === "completed" ? "tab active" : "tab"}
          onClick={() => setTab("completed")}
        >
          COMPLETED ({
            projects.filter(p => p.status.statusName === "Completed").length
          })
        </button>
      </nav>

      {/* Grid layout displaying project cards */}
      <div className="projects-grid">
        {visible.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            onView={openView}
            onEdit={openEdit}
            onDelete={deleteProject}
          />
        ))}
      </div>

      {/* View-only modal for showing detailed project info */}
      <ViewProjectModal
        isOpen={Boolean(viewing)}
        project={viewing}
        onClose={closeView}
      />

      {/* Shared modal for adding/editing projects */}
      <ProjectModal
        isOpen={modalOpen}
        initial={editing}
        onClose={handleModalClose}
      />

    </PortalLayout>
  );
}
