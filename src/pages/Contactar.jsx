import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, Send, MessageSquare } from 'lucide-react';
import './Contactar.css';

const Contactar = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setIsError(true);
      setTimeout(() => setIsError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contactar-page">
      <div className="contactar-content">
        <motion.div 
          className="contactar-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="contactar-title-container">
            <MessageSquare size={40} className="contactar-icon" />
            <h1 className="contactar-title">
              Ponte en <span className="highlight-text">Contacto</span>
            </h1>
          </div>
          <p className="contactar-subtitle">
            ¿Tienes un proyecto en mente o una oportunidad de colaboración? ¡Hablemos!
          </p>
        </motion.div>

        <div className="contactar-grid">
          {/* Contact Info Column */}
          <motion.div 
            className="contact-info-container"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact-card">
              <h3 className="contact-card-title">Información Directa</h3>
              <p className="contact-card-desc">
                Siempre estoy abierto a discutir nuevas oportunidades, proyectos innovadores o colaboraciones tecnológicas.
              </p>
              
              <div className="contact-details">
                {profile?.email && (
                  <div className="contact-item">
                    <div className="contact-icon-wrapper">
                      <Mail size={20} />
                    </div>
                    <div className="contact-item-text">
                      <span className="contact-item-label">Email</span>
                      <a href={`mailto:${profile.email}`} className="contact-item-value">{profile.email}</a>
                    </div>
                  </div>
                )}
                
                {profile?.phone && (
                  <div className="contact-item">
                    <div className="contact-icon-wrapper">
                      <Phone size={20} />
                    </div>
                    <div className="contact-item-text">
                      <span className="contact-item-label">Teléfono</span>
                      <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="contact-item-value">{profile.phone}</a>
                    </div>
                  </div>
                )}
                
                {profile?.location && (
                  <div className="contact-item">
                    <div className="contact-icon-wrapper">
                      <MapPin size={20} />
                    </div>
                    <div className="contact-item-text">
                      <span className="contact-item-label">Ubicación</span>
                      <span className="contact-item-value">{profile.location}</span>
                    </div>
                  </div>
                )}
                
                {profile?.linkedin && (
                  <div className="contact-item">
                    <div className="contact-icon-wrapper">
                      <Briefcase size={20} />
                    </div>
                    <div className="contact-item-text">
                      <span className="contact-item-label">LinkedIn</span>
                      <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="contact-item-value">
                        {profile.linkedin}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div 
            className="contact-form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form className="glass-form" onSubmit={handleSubmit}>
              <h3 className="form-title">Envíame un mensaje</h3>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Tu Nombre</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-input" 
                  placeholder="Ej. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Tu Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input" 
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Tu Mensaje</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="form-input form-textarea" 
                  placeholder="Cuéntame sobre tu proyecto..."
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${isSuccess ? 'success' : ''} ${isError ? 'error-btn' : ''}`}
                disabled={isSubmitting}
                style={isError ? {background: '#ef4444'} : {}}
              >
                {isSubmitting ? (
                  <span>Enviando...</span>
                ) : isSuccess ? (
                  <span>¡Mensaje Enviado!</span>
                ) : isError ? (
                  <span>Error al Enviar</span>
                ) : (
                  <>
                    <span>Enviar Mensaje</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contactar;
