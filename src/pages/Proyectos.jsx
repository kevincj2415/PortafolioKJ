import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import './Proyectos.css';

const Proyectos = ({ projects }) => {
  return (
    <div className="proyectos-page">
      <div className="proyectos-content">
        <motion.div 
          className="proyectos-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="proyectos-title-container">
            <FolderGit2 size={40} className="proyectos-icon" />
            <h1 className="proyectos-title">
              Mis <span className="highlight-text">Proyectos</span>
            </h1>
          </div>
          <p className="proyectos-subtitle">
            Explora una selección de mis trabajos más recientes y destacados.
          </p>
        </motion.div>

        <div className="proyectos-grid">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <div className="no-projects">
              <p>No hay proyectos para mostrar aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Proyectos;
