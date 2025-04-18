// useState lets me toggle the visibility of the kebab menu easily.
// useRef helps me keep track of the menu element to handle clicks outside of it.
// useEffect ensures event listeners are added/removed properly, preventing memory leaks.
// The e.stopPropagation() is crucial—it prevents the click on the menu from also triggering the card's click event, making the UI interactions clean and intuitive.


import React, { useState, useRef, useEffect } from "react";

// State to control if the "⋯" menu (kebab menu) is open or closed
// useRef to keep a reference to the kebab menu (⋯ menu)
// This helps me detect clicks outside the menu to close it
export default function ProjectCard({ project, onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);   // menu visibility
  const menuRef = useRef(null);

  // useEffect runs once when the component first mounts
  // It sets up a listener for clicks outside the kebab menu to close it automatically
  useEffect(() => {
    const hideMenuOnClickOutside = (e) => {
      // If I clicked outside the kebab menu, close it
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    // Attach the click event to the document
    document.addEventListener("mousedown", hideMenuOnClickOutside);

    // Clean up: remove the event listener when the component unmounts
    return () => document.removeEventListener("mousedown", hideMenuOnClickOutside);
  }, []); // The empty array means it runs only once on mount/unmount

  return (
    // Clicking anywhere on the card opens the "View Project" modal
    <div className="project-card card" onClick={() => onView(project)}>
      {/* Header row: project name + kebab button */}
      <div className="card-head">
        <h4 className="h4">{project.projectName}</h4>

        {/* ⋯ kebab menu button, clicking this toggles the menu open/closed */}
        <button
          className="kebab-btn"
          onClick={e => {             // Stops the click event bubbling to the card's onClick.
            e.stopPropagation();      // Prevents accidental opening of the view modal
            setOpen(!open);
          }}
        >
          ⋯
        </button>

        {open && (
          <ul className="kebab-menu" ref={menuRef} onClick={e => e.stopPropagation()}>
            {/* Each menu option (View, Edit, Delete) calls the corresponding handler */}
            <li onClick={() => { onView(project);  setOpen(false); }}>View</li>
            <li onClick={() => { onEdit(project);  setOpen(false); }}>Edit</li>
            <li onClick={() => { onDelete(project.id); setOpen(false); }}>Delete</li>
          </ul>
        )}
      </div>

      <p>{project.description}</p>

      <p>
        <strong>Start:</strong>{" "}
        {new Date(project.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>End:</strong>{" "}
        {new Date(project.endDate).toLocaleDateString()}
      </p>
    </div>
  );
}
