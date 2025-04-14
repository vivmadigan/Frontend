import React from 'react'
import Sidebar from '../sections/Sidebar'
import Header from '../sections/Header'

const PortalLayout = ({ children }) => {
    return (
      <div className="wrapper-portal">
        <Sidebar />
        <Header />
        <main>{children}</main>
      </div>
    );
  };
  

export default PortalLayout