import { MenuIcon, LogOutIcon, BellIcon, ShipWheelIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ onToggleSidebar }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatpage = location.pathname?.startsWith("/chat/");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-50 h-16 flex items-center shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left side: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            className="btn btn-ghost lg:hidden"
            onClick={onToggleSidebar}
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {isChatpage && (
            <Link to="/" className="flex items-center gap-2">
              <ShipWheelIcon className="w-7 h-7 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Streamfy
              </span>
            </Link>
          )}
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-4">
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle hover:bg-base-300 transition">
              <BellIcon className="h-6 w-6 text-base-content opacity-80" />
            </button>
          </Link>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          <button
            className="btn btn-ghost btn-circle hover:bg-error/20 transition"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-80" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
