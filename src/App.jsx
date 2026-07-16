import { useEffect, useState, useRef, useCallback, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Proyectos from './pages/Proyectos';
import Contactar from './pages/Contactar';
import MusicPlayer from './components/MusicPlayer';
import './App.css';
import './index.css';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

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
        const [dataRes, weatherRes] = await Promise.all([
          fetch('/api/data'),
          fetch('/api/weather')
        ]);
        
        if (dataRes.ok) {
          const portfolioData = await dataRes.json();
          setData(portfolioData);
        }
        
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          setWeather(wData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
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
        <Route path="/login" element={
          <Suspense fallback={<div className="loading-fallback">Cargando...</div>}>
            <Login />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<div className="loading-fallback">Cargando...</div>}>
            <Dashboard profile={profile} />
          </Suspense>
        } />
      </Routes>

      {/* Footer Section */}
      {!isSecretPage && <Footer profile={profile} />}

    </main>
  )
}

export default App;
