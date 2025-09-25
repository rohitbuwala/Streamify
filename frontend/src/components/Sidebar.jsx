import { BellIcon, HomeIcon, ShipWheelIcon, UserIcon, XIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentpath = location.pathname;

  const linkClasses = (path) =>
    `btn btn-ghost w-full justify-start gap-3 px-3 normal-case ${
      currentpath === path ? "bg-primary/10 text-primary" : ""
    }`;

  return (
    <aside
      className={`fixed lg:static top-0 left-0 h-screen w-64 flex flex-col bg-base-200 border-r border-base-300 transform transition-transform duration-300 z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Header */}
      <div className="p-5 border-b border-base-300 flex items-center justify-between flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsSidebarOpen(false)}>
          <ShipWheelIcon className="w-8 h-8 text-primary" />
          <span className="hidden sm:inline-block text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamfy
          </span>
        </Link>

        {/* Close button */}
        <button
          className="lg:hidden btn btn-ghost rounded-md p-2 hover:bg-base-300/60"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation (scrollable) */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <Link to="/" className={linkClasses("/")} onClick={() => setIsSidebarOpen(false)}>
          <HomeIcon className="w-5 h-5 opacity-80" />
          <span>Home</span>
        </Link>

        <Link to="/friends" className={linkClasses("/friends")} onClick={() => setIsSidebarOpen(false)}>
          <UserIcon className="w-5 h-5 opacity-80" />
          <span>Friends</span>
        </Link>

        <Link to="/notifications" className={linkClasses("/notifications")} onClick={() => setIsSidebarOpen(false)}>
          <BellIcon className="w-5 h-5 opacity-80" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* User info pinned at bottom */}
      <div className="p-4 border-t border-base-300 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img
                src={authUser?.profilePic || "https://api.dicebear.com/6.x/initials/svg?seed=User"}
                alt="User Avatar"
              />
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
