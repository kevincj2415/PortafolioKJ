import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Link as LinkIcon, QrCode } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import './IDCardPresentation.css';

const IDCardPresentation = ({ profile, weather, imageUrl }) => {
  const isMobile = useIsMobile();

  const Wrapper = isMobile ? 'div' : motion.div;
  const wrapperProps = isMobile ? {} : {
    initial: { y: 50, opacity: 0, rotateX: 10 },
    animate: { y: 0, opacity: 1, rotateX: 0 },
    transition: { duration: 0.8, type: "spring", bounce: 0.4 },
  };

  return (
    <Wrapper className="id-card-container" {...wrapperProps}>
      <div className="id-card-glass horizontal">
        <div className="ambient-glow" />

        {/* Lanyard Hole */}
        <div className="lanyard-hole-container">
          <div className="lanyard-hole"></div>
        </div>

        <div className="id-card-body">
          {/* Left Column: Photo & Barcode */}
          <div className="id-card-left">
            <div className="id-photo-container">
              <div className="id-photo-frame">
                <img src={imageUrl} alt="Profile" className="id-photo" />
              </div>
            </div>

            <div className="id-personal-info">
              <h1 className="id-name">{profile?.name || "KJGC"}</h1>
              <h2 className="id-role">{profile?.role || "Ingeniero de Sistemas"}</h2>
            </div>

            <div className="barcode">
              <QrCode size={40} className="qr-icon" />
              <div className="barcode-bars"></div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="id-card-right">
            <div className="id-card-header">
              <span className="company-logo">INGENIERO DE SISTEMAS</span>
              <span className="id-number">ID: {Math.floor(Math.random() * 90000) + 10000}</span>
            </div>

            <div className="id-info">

              <div className="id-details">
                <p className="id-about">{profile?.about}</p>
              </div>

              <div className="id-contact">
                {profile?.email && <a href={`mailto:${profile.email}`}><Mail size={18} /></a>}
                <a href={`https://${profile?.linkedin}`} target="_blank" rel="noreferrer"><LinkIcon size={18} /></a>
                <span className="weather-badge">
                  <MapPin size={16} /> {weather ? `${weather.name} | ${Math.round(weather.main.temp)}°C` : "Colombia"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default IDCardPresentation;
