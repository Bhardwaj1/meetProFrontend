import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async() => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-xl border-b border-white/10">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-white"
        >
          Meet<span className="text-cyan-400">Pro</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-300 hover:text-cyan-400 transition">
            Dashboard
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-gray-300 hover:text-red-400 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#020617] border border-white/10 shadow-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Logout Confirmation
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to logout from MeetPro?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-sm bg-white/10 text-gray-300 hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
