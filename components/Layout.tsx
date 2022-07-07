import * as React from "react";
import Header from "./Header";
import NavBar from "./NavBar";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="drawer">
      <input id="side-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Header />
        {children}
      </div>
      <div className="drawer-side">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="side-drawer" className="drawer-overlay"></label>
        <NavBar />
      </div>
    </div>
  );
};

export default Layout;
