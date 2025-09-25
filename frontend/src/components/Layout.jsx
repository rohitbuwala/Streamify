import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ children, showSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative">
      {/* Backdrop when sidebar is open on mobile */}
      {showSidebar && (
        <div
          className={`fixed inset-0 bg-black/40 z-40 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar is z-50, always above navbar */}
      {showSidebar && (
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}

      <div className="flex flex-col flex-1 relative z-30">
        {/* Navbar stays below sidebar on mobile */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen((s) => !s)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
