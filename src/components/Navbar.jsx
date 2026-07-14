import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Proyectos', href: '/proyectos' },
    { name: 'Contactar', href: '/contactar' }
  ];

  return (
    <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <motion.nav 
        className="glass-navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="nav-container">
          <Link 
            to="/" 
            className="nav-logo" 
            onClick={closeMenu}
            onDoubleClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            <img 
              src="https://res.cloudinary.com/mzraxq6o/image/upload/v1784060449/Logo_KJ_azul_bwzs4s.svg" 
              alt="KJGC Logo" 
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-links desktop-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.href.startsWith('#') ? (
                  <a href={link.href}>{link.name}</a>
                ) : (
                  <Link to={link.href}>{link.name}</Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('#') ? (
                    <a href={link.href} onClick={closeMenu}>{link.name}</a>
                  ) : (
                    <Link to={link.href} onClick={closeMenu}>{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
