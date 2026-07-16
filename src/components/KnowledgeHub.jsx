import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, GraduationCap, Award, Cpu, Globe, Users } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import './KnowledgeHub.css';

const KnowledgeHub = ({ education, skills, courses }) => {
  const techSkills = skills.filter(s => s.category === 'Tecnología');
  const langSkills = skills.filter(s => s.category === 'Idioma');
  const softSkills = skills.filter(s => s.category === 'Blanda');

  const isMobile = useIsMobile();
  const M = isMobile ? 'div' : motion.div;
  const MH3 = isMobile ? 'h3' : motion.h3;

  return (
    <section id="conocimiento" className="knowledge-hub-section optimized-section">
      <div className="knowledge-container">
        
        <M 
          className="section-header center hardware-accelerated"
          {...(!isMobile && {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0 },
          })}
        >
          <div className="header-icon-wrapper purple-glow">
            <BrainCircuit size={28} className="header-icon-purple" />
          </div>
          <h2>Conocimiento y Formación</h2>
          <div className="header-line purple-line"></div>
        </M>

        <div className="knowledge-grid">
          
          {/* Left Column: Skills */}
          <div className="skills-column">
            
            {techSkills.length > 0 && (
              <M 
                className="skill-card tech-card hardware-accelerated"
                {...(!isMobile && {
                  initial: { opacity: 0, x: -30 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true, amount: 0 },
                })}
              >
                <div className="card-header">
                  <Cpu size={24} className="card-icon tech-icon"/>
                  <h3>Tecnologías</h3>
                </div>
                <div className="tech-tags">
                  {techSkills.map(s => (
                    <div key={s.id} className="tech-tag">
                      {s.name}
                    </div>
                  ))}
                </div>
              </M>
            )}

            {softSkills.length > 0 && (
              <M 
                className="skill-card soft-card hardware-accelerated"
                {...(!isMobile && {
                  initial: { opacity: 0, x: -30 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { delay: 0.1 },
                  viewport: { once: true, amount: 0 },
                })}
              >
                <div className="card-header">
                  <Users size={24} className="card-icon soft-icon"/>
                  <h3>Habilidades Blandas</h3>
                </div>
                <div className="soft-list">
                  {softSkills.map(s => (
                    <div key={s.id} className="soft-item">
                      <span className="soft-bullet"></span>
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </M>
            )}

            {langSkills.length > 0 && (
              <M 
                className="skill-card lang-card hardware-accelerated"
                {...(!isMobile && {
                  initial: { opacity: 0, x: -30 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { delay: 0.2 },
                  viewport: { once: true, amount: 0 },
                })}
              >
                <div className="card-header">
                  <Globe size={24} className="card-icon lang-icon"/>
                  <h3>Idiomas</h3>
                </div>
                <div className="lang-list">
                  {langSkills.map(s => (
                    <div key={s.id} className="lang-item">
                      <div className="lang-name">{s.name}</div>
                      <div className="lang-detail">{s.details}</div>
                    </div>
                  ))}
                </div>
              </M>
            )}
          </div>

          {/* Right Column: Education & Courses */}
          <div className="education-column">
            
            <MH3 
              className="column-title hardware-accelerated"
              {...(!isMobile && {
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0 },
              })}
            >
              <GraduationCap size={24} /> Educación Académica
            </MH3>
            
            <div className="edu-list">
              {education.map((ed, i) => (
                <M 
                  key={ed.id} 
                  className="edu-card glass-panel hardware-accelerated"
                  {...(!isMobile && {
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { delay: i * 0.1 },
                    viewport: { once: true, amount: 0 },
                  })}
                >
                  <div className="edu-glow"></div>
                  <span className="edu-date">{ed.dateRange}</span>
                  <h4 className="edu-inst">{ed.institution}</h4>
                  <div className="edu-degree">{ed.degree}</div>
                  {ed.details && <p className="edu-details">{ed.details}</p>}
                </M>
              ))}
            </div>

            {courses.length > 0 && (
              <>
                <MH3 
                  className="column-title hardware-accelerated" style={{ marginTop: '3rem' }}
                  {...(!isMobile && {
                    initial: { opacity: 0, y: 10 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0 },
                  })}
                >
                  <Award size={24} /> Cursos y Certificaciones
                </MH3>
                
                <div className="courses-grid">
                  {courses.map((c, i) => (
                    <M 
                      key={c.id} 
                      className="course-item hardware-accelerated"
                      {...(!isMobile && {
                        initial: { opacity: 0, scale: 0.9 },
                        whileInView: { opacity: 1, scale: 1 },
                        transition: { delay: i * 0.05 },
                        viewport: { once: true, amount: 0 },
                      })}
                    >
                      <div className="course-title">{c.title}</div>
                      <div className="course-year">{c.year}</div>
                    </M>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHub;
