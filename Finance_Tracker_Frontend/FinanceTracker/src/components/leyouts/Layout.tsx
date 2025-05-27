import React from "react";
import Header from "./Header";
import Footer from "./Footer";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="dark-layout">
      <Header />
      <main className="dark-main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
