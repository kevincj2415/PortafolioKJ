import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import './ExperienceTimeline.css';

const ExperienceTimeline = ({ experience }) => {
  if (!experience || experience.length === 0) return null;

  const isMobile = useIsMobile();
  const M = isMobile ? 'div' : motion.div;

  return (
    <section id="experiencia" className="experience-section optimized-section">
      <div className="experience-container">
        
        <M 
          className="section-header hardware-accelerated"
          {...(!isMobile && {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0 },
          })}
        >
          <div className="header-icon-wrapper">
            <Briefcase size={28} className="header-icon" />
          </div>
          <h2>Trayectoria Profesional</h2>
          <div className="header-line"></div>
        </M>

        <div className="timeline">
          {experience.map((exp, index) => (
            <M 
              key={exp.id} 
              className="timeline-node hardware-accelerated"
              {...(!isMobile && {
                initial: { opacity: 0, x: -40 },
                whileInView: { opacity: 1, x: 0 },
                transition: { delay: index * 0.1, type: "spring", stiffness: 50 },
                viewport: { once: true, amount: 0 },
              })}
            >
              <div className="timeline-marker">
                <div className="marker-core"></div>
                <div className="marker-pulse"></div>
              </div>
              
              <div className="timeline-content glass-panel">
                <div className="exp-meta">
                  <span className="exp-period">{exp.dateRange}</span>
                  <span className="exp-company">{exp.company}</span>
                </div>
                
                <h3 className="exp-role">{exp.role}</h3>
                
                <ul className="exp-description">
                  {exp.achievements?.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </M>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
