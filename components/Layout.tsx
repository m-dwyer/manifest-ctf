import * as React from "react";
import Header from "./Header";
import MainContent from "./MainContent";
import NavBar from "./NavBar";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="bg-base-500">
    <Header />
    <div className="drawer drawer-mobile">
      <input id="side-drawer" type="checkbox" className="drawer-toggle" />
      <MainContent>{children}</MainContent>
      <div className="drawer-side">
        <NavBar />
      </div>
    </div>
  </div>
);

export default Layout;
