import React from 'react';
import NavLinkItem from '../components/NavLinkItem';

const NavLinks = () => {
  return (
    <nav className="nav-links">
      <NavLinkItem to="/projects" text="Projects" iconClass="fa-solid fa-folder" />

    </nav>
  );
};

export default NavLinks;