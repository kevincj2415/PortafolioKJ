import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Code2 } from 'lucide-react';
import './ProjectCard.css';

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div 
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -10 }}
    >
      <div className="project-image-container">
        <div className="project-overlay"></div>
        <img src={project.imageUrl} alt={project.title} className="project-image" />
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        
        <div className="project-tech-stack">
          {project.technologies?.map((tech, i) => (
            <span key={i} className="tech-badge">
              <Code2 size={12} />
              {tech}
            </span>
          ))}
        </div>
        
        <div className="project-actions">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-btn btn-github">
              <GitBranch size={18} />
              <span>Código</span>
            </a>
          )}
          {project.webUrl && (
            <a href={project.webUrl} target="_blank" rel="noreferrer" className="project-btn btn-web">
              <ExternalLink size={18} />
              <span>Visitar Web</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
