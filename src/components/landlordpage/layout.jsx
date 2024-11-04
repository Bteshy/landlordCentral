// Layout.js

import React from 'react';
import Header from './header'; // Import your header component
import Sidebar from './sidebar'; // Import your sidebar component

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
