import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('auth_token', data.token);
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
