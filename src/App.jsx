import { useEffect, useState, useRef, useCallback } from 'react';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema.js';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Proyectos from './pages/Proyectos';
import Contactar from './pages/Contactar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import './index.css';

function App() {
  const [data, setData] = useState({ profile: null, experience: [], education: [], skills: [], courses: [], projects: [] });
  const [weather, setWeather] = useState(null);
  const location = useLocation();

  // URLs optimizadas con Cloudinary (ancho 1280px y calidad automática) para mejorar el rendimiento
  const mainVideo = "https://res.cloudinary.com/mzraxq6o/video/upload/w_1280,q_auto/v1784057263/199621-910995780_fe1daa.mp4";
  const projectsVideo = "https://res.cloudinary.com/mzraxq6o/video/upload/w_1280,q_auto/v1784061183/156359-812591863_fblypr.mp4";
  const contactVideo = "https://res.cloudinary.com/mzraxq6o/video/upload/w_1280,q_auto/v1784064001/180078-863401749_ufkzro.mp4";
  const secretVideo = "https://res.cloudinary.com/mzraxq6o/video/upload/f_webm,vc_vp9/v1784066954/91562-629172467_eakfwy";

  const isProjects = location.pathname === '/proyectos';
  const isContact = location.pathname === '/contactar';
  const isSecretPage = location.pathname === '/login' || location.pathname === '/dashboard';

  const isMain = !isProjects && !isContact && !isSecretPage;

  // Refs para controlar los videos y no saturar la GPU
  const vidMain = useRef(null);
  const vidProj = useRef(null);
  const vidCont = useRef(null);
  const vidSec = useRef(null);

  // Track which videos have loaded enough data to display
  const [videoReady, setVideoReady] = useState({});
  const handleVideoReady = useCallback((key) => {
    setVideoReady(prev => ({ ...prev, [key]: true }));
  }, []);

  useEffect(() => {
    // Reproducir el video activo de inmediato
    if (isMain && vidMain.current) vidMain.current.play().catch(e => console.log(e));
    if (isProjects && vidProj.current) vidProj.current.play().catch(e => console.log(e));
    if (isContact && vidCont.current) vidCont.current.play().catch(e => console.log(e));
    if (isSecretPage && vidSec.current) vidSec.current.play().catch(e => console.log(e));

    // Pausar los inactivos tras 1 segundo (dejando que termine el fade)
    const timeout = setTimeout(() => {
      if (!isMain && vidMain.current) vidMain.current.pause();
      if (!isProjects && vidProj.current) vidProj.current.pause();
      if (!isContact && vidCont.current) vidCont.current.pause();
      if (!isSecretPage && vidSec.current) vidSec.current.pause();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.pathname, isMain, isProjects, isContact, isSecretPage]);

  // Data fetching
  useEffect(() => {
    async function loadData() {
      try {
        if (!import.meta.env.VITE_DATABASE_URL) throw new Error("Missing VITE_DATABASE_URL");
        const sql = neon(import.meta.env.VITE_DATABASE_URL);
        const db = drizzle(sql, { schema });

        const [p, e, edu, s, c, prj] = await Promise.all([
          db.select().from(schema.profile),
          db.select().from(schema.experience),
          db.select().from(schema.education),
          db.select().from(schema.skills),
          db.select().from(schema.courses),
          db.select().from(schema.projects)
        ]);

        setData({ profile: p[0], experience: e, education: edu, skills: s, courses: c.sort((a, b) => b.year - a.year), projects: prj });

        const apiKey = import.meta.env.VITE_OPENWEATHER_API;
        if (apiKey) {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Pereira,CO&appid=${apiKey}&units=metric&lang=es`);
          const wData = await res.json();
          if (wData.weather) setWeather(wData);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    loadData();
  }, []);

  const { profile, experience, education, skills, courses } = data;

  return (
    <main className="page-wrapper">

      {/* Background Video - Only active video preloads, others deferred */}
      <div className="video-background">
        <video
          ref={vidMain}
          src={mainVideo}
          preload={isMain ? 'auto' : 'none'}
          autoPlay loop muted playsInline
          className={isMain && videoReady.main ? 'active' : ''}
          onCanPlayThrough={() => handleVideoReady('main')}
        />
        <video
          ref={vidProj}
          src={projectsVideo}
          preload={isProjects ? 'auto' : 'none'}
          autoPlay loop muted playsInline
          className={isProjects && videoReady.proj ? 'active' : ''}
          onCanPlayThrough={() => handleVideoReady('proj')}
        />
        <video
          ref={vidCont}
          src={contactVideo}
          preload={isContact ? 'auto' : 'none'}
          autoPlay loop muted playsInline
          className={isContact && videoReady.cont ? 'active' : ''}
          onCanPlayThrough={() => handleVideoReady('cont')}
        />
        <video
          ref={vidSec}
          src={secretVideo}
          preload={isSecretPage ? 'auto' : 'none'}
          autoPlay loop muted playsInline
          className={isSecretPage && videoReady.sec ? 'active' : ''}
          onCanPlayThrough={() => handleVideoReady('sec')}
        />
      </div>

      {/* Navbar solo visible fuera del login/dashboard */}
      {!isSecretPage && <Navbar />}

      {/* Global Music Player (opcional: se puede ocultar en secretPage) */}
      <MusicPlayer />

      <Routes>
        <Route path="/" element={<Home data={data} weather={weather} />} />
        <Route path="/proyectos" element={<Proyectos projects={data.projects} />} />
        <Route path="/contactar" element={<Contactar profile={data.profile} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Footer Section */}
      {!isSecretPage && <Footer profile={profile} />}

    </main>
  )
}

export default App;
