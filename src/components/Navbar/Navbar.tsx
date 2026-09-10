import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "info");
    navigate("/login");
  };

  const roleBadgeStyle = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "support_agent":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-800 text-base md:text-lg">
          Service Portal
        </span>
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white text-sm shadow-sm shadow-blue-500/30">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-block rounded border px-1.5 py-0.2 text-[10px] font-semibold capitalize ${roleBadgeStyle(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role ? currentUser.role.replace("_", " ") : "User"}
                </span>
                <span className="text-[11px] text-gray-400">
                  {currentUser.department}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Welcome</span>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;