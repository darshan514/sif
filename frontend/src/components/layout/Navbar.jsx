import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isSafetyOfficer, isEmployee, logout } = useAuth();

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Predict SIF', path: '/predict' },
        { name: 'Architecture', path: '/about' },
      ];
    }

    if (isSafetyOfficer) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Executive Dashboard', path: '/officer-dashboard' },
        { name: 'Predict & Report', path: '/predict' },
        { name: 'Batch Analysis', path: '/batch' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Audit Log', path: '/history' },
        { name: 'Architecture', path: '/about' },
      ];
    }

    // Default Employee Links
    return [
      { name: 'Home', path: '/' },
      { name: 'My Dashboard', path: '/employee-dashboard' },
      { name: 'Predict & Report', path: '/predict' },
      { name: 'My Reports', path: '/my-reports' },
      { name: 'My History', path: '/history' },
      { name: 'Architecture', path: '/about' },
    ];
  };

  const navLinks = getNavLinks();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-white/80 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] z-50 flex justify-between items-center px-6 sm:px-8 py-3 transition-colors duration-200">
      
      {/* Brand Logo */}
      <Link to="/" className="font-extrabold text-2xl tracking-tighter text-[#FF5E3A] flex items-center gap-2">
        <svg className="h-8 w-8 text-black" fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"></circle>
          <path d="M11 10V22M21 10V22M11 16H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
        </svg>
        <span className="text-slate-900 font-extrabold font-heading text-xl">
          SIF<span className="text-[#FF5E3A]">.AI</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-5">
        {navLinks.map((link) => {
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-semibold transition-all duration-200 scale-95 active:scale-90 ${
                active
                  ? 'text-[#FF5E3A] font-extrabold'
                  : 'text-slate-600 hover:text-[#FF5E3A]'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-white/80 border border-white/90 px-3.5 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-800 hover:bg-white transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-extrabold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[100px] truncate">{user?.name || 'Profile'}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {isSafetyOfficer ? 'Officer' : 'Worker'}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-extrabold text-slate-700 hover:text-slate-900 px-3 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#FF5E3A] hover:bg-[#ff4820] text-white font-extrabold text-xs px-5 py-2 rounded-full shadow-md transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
