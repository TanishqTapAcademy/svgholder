import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome
        ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-lg transform group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              scrolled || !isHome ? 'text-gray-800' : 'text-white'
            } group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent`}>
              SVG Holder
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/svg-viewer"
              className={`relative font-medium transition-all duration-300 group ${
                scrolled || !isHome ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
              } ${location.pathname === '/svg-viewer' ? 'text-purple-600' : ''}`}
            >
              <span className="relative z-10">SVG Viewer</span>
              <div className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transform transition-transform duration-300 origin-left ${
                location.pathname === '/svg-viewer' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></div>
            </Link>
            <Link 
              to="/svg-importer"
              className={`relative font-medium transition-all duration-300 group ${
                scrolled || !isHome ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
              } ${location.pathname === '/svg-importer' ? 'text-purple-600' : ''}`}
            >
              <span className="relative z-10">SVG Importer</span>
              <div className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transform transition-transform duration-300 origin-left ${
                location.pathname === '/svg-importer' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></div>
            </Link>
            
            {/* CTA Button */}
            <Link 
              to="/svg-importer"
              className="relative px-6 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full text-white font-medium overflow-hidden group"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                Get Started
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
