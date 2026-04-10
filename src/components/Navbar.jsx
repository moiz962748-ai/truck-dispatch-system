import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleNavClick = (href, e) => {
    if (href.startsWith('/#') && location.pathname === '/') {
      e.preventDefault();
      const elementId = href.substring(2); // remove '/#'
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsOpen(false);
    navigate('/login');
  };

  const isNavActive = (href) => {
    if (href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (href.startsWith('/#')) {
      return location.pathname === '/' && location.hash === href.slice(1);
    }
    return location.pathname === href;
  };

  const navItems = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
    ...(token
      ? role === 'admin'
        ? [{ label: 'Admin Dashboard', href: '/admin' }]
        : [{ label: 'Driver Dashboard', href: '/dashboard' }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">TD</span>
          </div>
          <span className="hidden sm:inline text-lg font-bold text-slate-900">Truck Dispatch</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              className={() =>
                `text-sm font-medium transition-all ${
                  isNavActive(item.href)
                    ? 'text-blue-600 underline underline-offset-4 decoration-blue-400'
                    : 'text-slate-700 hover:text-slate-900 hover:decoration-slate-400'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!token && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}
          {token && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 border border-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          <svg
            className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-slate-200 bg-white"
        >
          <div className="px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className="block text-sm text-slate-700 font-medium hover:text-slate-900 py-2"
              >
                {item.label}
              </Link>
            ))}
            {!token && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-slate-700 font-medium hover:text-slate-900 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
            {token && (
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium text-red-600 border border-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;
