import { useState } from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { HiMenu, HiX } from 'react-icons/hi';

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  const menuItems = user.role === 'admin'
    ? [
        { name: 'Admin Panel', path: '/admin' },
        { name: 'Profile', path: '/profile' }
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Profile', path: '/profile' }
      ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0`}>
        <div className="p-4 font-bold text-xl border-b border-gray-700 flex justify-between items-center md:hidden">
          <span>Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <HiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map(item => (
            <Link key={item.name} to={item.path} className="hover:bg-gray-700 rounded px-3 py-2">
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hover:bg-gray-700 rounded px-3 py-2 mt-4 text-left"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="mr-4 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <HiMenu size={24} />
            </button>
            <h1 className="text-xl font-bold">welcome</h1>
          </div>

          <div className="relative">
            <button
              className="hover:underline"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {user.name}
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 w-40 bg-white text-black rounded shadow-lg"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                  Profile
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Role-based content */}
        <main className="flex-1 p-4">
          {user.role === 'admin' ? (
            <div className="p-4 bg-gray-100 rounded shadow mb-4">
              <h2 className="text-xl font-bold mb-2">Admin Panel</h2>
              <p>Welcome, Admin! Here you can manage the system.</p>
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded shadow mb-4">
              <h2 className="text-xl font-bold mb-2">User Dashboard</h2>
              <p>Welcome! Here is your default dashboard.</p>
            </div>
          )}
          <Outlet />
        </main>
          <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
    &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
  </footer>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-around">
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
