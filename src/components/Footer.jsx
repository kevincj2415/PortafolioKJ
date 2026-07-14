import React from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Code2, ChevronUp } from 'lucide-react';
import './Footer.css';

const Footer = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="footer-glow-line"></div>
      
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo">
              <Code2 size={28} className="brand-icon" />
            </div>
            <h3>{profile?.name || "KJGC"}</h3>
            <p className="brand-tagline">
              {profile?.role || "Ingeniero de Sistemas"}
            </p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Navegación</h4>
              <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#experiencia">Trayectoria</a></li>
                <li><a href="#conocimiento">Conocimiento</a></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Contacto</h4>
              <ul className="contact-list">
                {profile?.email && (
                  <li>
                    <Mail size={16}/> 
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </li>
                )}
                {profile?.linkedin && (
                  <li>
                    <LinkIcon size={16}/> 
                    <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
                  </li>
                )}
                {profile?.phone && (
                  <li>
                    <Phone size={16}/> 
                    <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="footer-action">
            <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Volver arriba">
              <ChevronUp size={24} />
            </button>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} {profile?.name || "KJGC"}. Todos los derechos reservados.
          </div>
          <div className="crafted-with">
            Diseñado con <span className="heart">♥</span> y mucha lógica.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
