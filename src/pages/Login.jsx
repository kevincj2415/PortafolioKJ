import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import * as schema from '../db/schema.js';
import { Shield, Key, Lock, Terminal } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      if (!import.meta.env.VITE_DATABASE_URL) throw new Error("Missing DB URL");
      
      const sql = neon(import.meta.env.VITE_DATABASE_URL);
      const db = drizzle(sql, { schema });
      
      // Buscar usuario admin
      const result = await db.select().from(schema.users);
      const adminUser = result.find(u => u.username === 'admin');

      if (adminUser) {
        // Comparar contraseña con el hash
        const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
        if (isMatch) {
          // Token básico de sesión (para demostración frontend)
          localStorage.setItem('auth_token', 'kjgc_admin_secured');
          navigate('/dashboard');
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(true);
    } finally {
      setLoading(false);
      // Quitar clase de error después de animación
      if(error) setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${error ? 'error-shake' : ''}`}>
        <div className="login-header">
          <Shield size={50} className="login-icon" />
          <h2>Acceso Restringido</h2>
          <p>Identificación Requerida</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Ingrese clave de acceso..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="scanning-text">Verificando Credenciales...</span>
            ) : (
              <>
                <Terminal size={18} />
                <span>Inicializar Sistema</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
