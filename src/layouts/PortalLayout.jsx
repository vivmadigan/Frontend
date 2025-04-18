import React from 'react';
import Sidebar from '../sections/Sidebar';
import Header from '../sections/Header';

// PortalLayout wraps page content with a consistent sidebar and header.
// The special prop "children" represents any content placed inside this component.
const PortalLayout = ({ children }) => {
  return (
    <div className="wrapper-portal">
      <Sidebar />   {/* Always displays the sidebar navigation */}
      <Header />    {/* Always displays the header section */}
      <main>{children}</main> {/* Main content passed in when using this layout */}
    </div>
  );
};

export default PortalLayout;
