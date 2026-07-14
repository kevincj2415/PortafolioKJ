import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Database, Settings, Edit2, Trash2, Plus, X, Save, Shield } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import './Dashboard.css';

const TABLES = {
  profile: {
    label: 'Perfil',
    icon: <Settings size={18}/>,
    singleRecord: true,
    fields: [
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'role', label: 'Rol', type: 'text' },
      { name: 'about', label: 'Sobre mí', type: 'textarea' },
      { name: 'phone', label: 'Teléfono', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'location', label: 'Ubicación', type: 'text' },
      { name: 'linkedin', label: 'LinkedIn', type: 'text' }
    ]
  },
  projects: {
    label: 'Proyectos',
    icon: <Database size={18}/>,
    singleRecord: false,
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'description', label: 'Descripción', type: 'textarea' },
      { name: 'imageUrl', label: 'URL de Imagen', type: 'text' },
      { name: 'githubUrl', label: 'URL de GitHub', type: 'text' },
      { name: 'webUrl', label: 'URL Web', type: 'text' },
      { name: 'technologies', label: 'Tecnologías (separadas por coma)', type: 'text', isArray: true }
    ]
  },
  experience: {
    label: 'Experiencia',
    icon: <Database size={18}/>,
    singleRecord: false,
    fields: [
      { name: 'company', label: 'Empresa', type: 'text' },
      { name: 'role', label: 'Cargo', type: 'text' },
      { name: 'dateRange', label: 'Fechas', type: 'text' },
      { name: 'achievements', label: 'Logros (separados por punto y coma)', type: 'textarea', isArray: true, arraySeparator: ';' }
    ]
  },
  education: {
    label: 'Educación',
    icon: <Database size={18}/>,
    singleRecord: false,
    fields: [
      { name: 'institution', label: 'Institución', type: 'text' },
      { name: 'degree', label: 'Título', type: 'text' },
      { name: 'dateRange', label: 'Fechas', type: 'text' },
      { name: 'details', label: 'Detalles (Promedio, etc.)', type: 'textarea' }
    ]
  },
  skills: {
    label: 'Habilidades',
    icon: <Database size={18}/>,
    singleRecord: false,
    fields: [
      { name: 'category', label: 'Categoría', type: 'select', options: ['Idioma', 'Tecnología', 'Blanda'] },
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'details', label: 'Detalles (Opcional)', type: 'text' }
    ]
  },
  courses: {
    label: 'Cursos',
    icon: <Database size={18}/>,
    singleRecord: false,
    fields: [
      { name: 'year', label: 'Año', type: 'number' },
      { name: 'title', label: 'Título del Curso', type: 'text' }
    ]
  },
  security: {
    label: 'Seguridad',
    icon: <Shield size={18}/>,
    isCustom: true
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Estado para la sección de Seguridad
  const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token !== 'kjgc_admin_secured') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  const getDb = () => {
    const sql = neon(import.meta.env.VITE_DATABASE_URL);
    return drizzle(sql, { schema });
  };

  const fetchData = async () => {
    if (activeTab === 'security') {
      setEditingRecord(null);
      setSecurityMessage({ type: '', text: '' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      return;
    }
    
    setLoading(true);
    try {
      const db = getDb();
      const tableSchema = schema[activeTab];
      const result = await db.select().from(tableSchema);
      setData(result);
      
      if (TABLES[activeTab].singleRecord && result.length > 0) {
        handleEdit(result[0]); // Auto-open edit for single records like Profile
      } else {
        setEditingRecord(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleEdit = (record) => {
    const config = TABLES[activeTab];
    const newFormData = { ...record };
    
    // Transformar arrays de vuelta a strings para el formulario
    config.fields.forEach(field => {
      if (field.isArray && Array.isArray(newFormData[field.name])) {
        const separator = field.arraySeparator || ',';
        newFormData[field.name] = newFormData[field.name].join(`${separator} `);
      }
    });

    setEditingRecord(record);
    setFormData(newFormData);
  };

  const handleCreateNew = () => {
    setEditingRecord({ id: 'new' });
    setFormData({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;
    
    setLoading(true);
    try {
      const db = getDb();
      const tableSchema = schema[activeTab];
      await db.delete(tableSchema).where(eq(tableSchema.id, id));
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
      setLoading(false);
    }
  };

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getDb();
      const tableSchema = schema[activeTab];
      const config = TABLES[activeTab];

      // Preparar datos, transformando strings separados a arrays si es necesario
      const payload = { ...formData };
      config.fields.forEach(field => {
        if (field.isArray && typeof payload[field.name] === 'string') {
          const separator = field.arraySeparator || ',';
          payload[field.name] = payload[field.name].split(separator).map(item => item.trim()).filter(Boolean);
        }
      });

      if (editingRecord.id === 'new') {
        // Insert
        await db.insert(tableSchema).values(payload);
      } else {
        // Update
        await db.update(tableSchema).set(payload).where(eq(tableSchema.id, editingRecord.id));
      }
      
      setEditingRecord(null);
      fetchData();
    } catch (error) {
      console.error("Error saving:", error);
      setLoading(false);
    }
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    setSecurityMessage({ type: '', text: '' });
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    try {
      const db = getDb();
      // Asumimos que el usuario es "admin"
      const result = await db.select().from(schema.users).where(eq(schema.users.username, 'admin'));
      
      if (result.length === 0) {
        setSecurityMessage({ type: 'error', text: 'Usuario administrador no encontrado' });
        setLoading(false);
        return;
      }
      
      const user = result[0];
      const isMatch = bcrypt.compareSync(securityData.currentPassword, user.passwordHash);
      
      if (!isMatch) {
        setSecurityMessage({ type: 'error', text: 'La contraseña actual es incorrecta' });
        setLoading(false);
        return;
      }
      
      const newHash = bcrypt.hashSync(securityData.newPassword, 10);
      await db.update(schema.users).set({ passwordHash: newHash }).where(eq(schema.users.id, user.id));
      
      setSecurityMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      setSecurityMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const config = TABLES[activeTab];
    if (config.isCustom) return null;
    
    
    return (
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h3>{editingRecord.id === 'new' ? 'Crear Nuevo' : 'Editar Registro'}</h3>
          {!config.singleRecord && (
            <button className="icon-btn close" onClick={() => setEditingRecord(null)}><X size={20}/></button>
          )}
        </div>
        
        <form onSubmit={handleSave} className="crud-form">
          {config.fields.map(field => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea 
                  value={formData[field.name] || ''} 
                  onChange={(e) => handleChange(e, field)}
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <select value={formData[field.name] || ''} onChange={(e) => handleChange(e, field)}>
                  <option value="">Selecciona...</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.type} 
                  value={formData[field.name] || ''} 
                  onChange={(e) => handleChange(e, field)}
                  required={field.name !== 'details' && field.name !== 'imageUrl' && field.name !== 'githubUrl' && field.name !== 'webUrl'}
                />
              )}
            </div>
          ))}
          <button type="submit" className="save-btn" disabled={loading}>
            <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    );
  };

  const renderTable = () => {
    const config = TABLES[activeTab];
    if (config.isCustom) return null;
    
    if (loading && data.length === 0) return <div className="loading-state">Cargando base de datos...</div>;

    if (config.singleRecord) {
      return null; // El formulario se renderiza automáticamente para singleRecords
    }

    return (
      <div className="crud-table-container">
        <div className="table-header-actions">
          <h3>Lista de {config.label}</h3>
          <button className="add-btn" onClick={handleCreateNew}><Plus size={18}/> Añadir Nuevo</button>
        </div>
        
        <div className="table-responsive">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                {config.fields.slice(0, 3).map(f => <th key={f.name}>{f.label}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id}>
                  <td>#{row.id}</td>
                  {config.fields.slice(0, 3).map(f => (
                    <td key={f.name}>
                      <span className="truncate-text">
                        {Array.isArray(row[f.name]) ? row[f.name].length + ' items' : row[f.name]}
                      </span>
                    </td>
                  ))}
                  <td className="actions-cell">
                    <button className="icon-btn edit" onClick={() => handleEdit(row)} title="Editar"><Edit2 size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(row.id)} title="Eliminar"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={5} className="empty-state">No hay registros aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSecurity = () => {
    if (activeTab !== 'security') return null;
    return (
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h3>Cambiar Contraseña</h3>
        </div>
        
        {securityMessage.text && (
          <div className={`security-alert ${securityMessage.type}`}>
            {securityMessage.text}
          </div>
        )}
        
        <form onSubmit={handleSecuritySave} className="crud-form">
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input 
              type="password" 
              value={securityData.currentPassword} 
              onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input 
              type="password" 
              value={securityData.newPassword} 
              onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              value={securityData.confirmPassword} 
              onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="save-btn" disabled={loading}>
            <Shield size={18}/> {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <LayoutDashboard size={24} className="sidebar-icon" />
          <h2>KJGC Admin</h2>
        </div>
        
        <ul className="sidebar-nav">
          {Object.entries(TABLES).map(([key, config]) => (
            <li 
              key={key} 
              className={activeTab === key ? 'active' : ''}
              onClick={() => setActiveTab(key)}
            >
              {config.icon} {config.label}
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Gestión de {TABLES[activeTab].label}</h1>
          <p>Administra los datos públicos de tu portafolio en tiempo real.</p>
        </div>

        <div className="dashboard-content">
          {activeTab === 'security' ? renderSecurity() : editingRecord ? renderForm() : renderTable()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
