import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import * as schema from './schema.js';

// Si corres este script desde Node, asegúrate de tener instalados los paquetes 'dotenv' y 'tsx' o usar '--experimental-modules'.
// Comando recomendado: npx tsx src/db/seed.js

const sql = neon(process.env.VITE_DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Iniciando el volcado de datos (seed)...");

  // 1. Limpiar las tablas (opcional, para evitar duplicados si corres el script varias veces)
  await db.delete(schema.projects);
  await db.delete(schema.courses);
  await db.delete(schema.skills);
  await db.delete(schema.education);
  await db.delete(schema.experience);
  await db.delete(schema.profile);
  await db.delete(schema.users);
  console.log("Tablas limpiadas.");

  // 2. Insertar Perfil
  await db.insert(schema.profile).values({
    name: "Kevin Jose Garcia Carvajal",
    role: "Ingeniero de sistemas",
    about: "Egresado de Ingeniería de Sistema de la Universidad Libre, con sólidas competencias en programación, desarrollo web, gestión de bases de datos y redes. Enfocado en la resolución de problemas y la optimización de procesos, busco aportar soluciones tecnológicas innovadoras que impulsen el crecimiento y la eficiencia de la compañía.",
    phone: "311 383 8879",
    email: "Kevincj2415@gmail.com",
    location: "Pereira, Risaralda",
    linkedin: "www.linkedin.com/in/kjgc_",
  });
  console.log("Perfil insertado.");

  // 3. Insertar Experiencia
  await db.insert(schema.experience).values({
    company: "Solutio S.A.S",
    role: "practicante",
    dateRange: "Mayo 2026 - Junio 2026",
    achievements: [
      "Automatización de Procesos: Desarrollé plantillas inteligentes y macros en Microsoft Office para automatizar la redacción de documentos legales (tutelas y contratos), logrando reducir el tiempo de procesamiento de 45 a solo 3 minutos por archivo.",
      "Gestión de Bases de Datos: Llevé a cabo la unificación, limpieza y normalización de la base de datos histórica de clientes en Excel, eliminando registros duplicados mediante lógica de datos y asegurando la integridad de la información.",
      "Transformación Digital: Diseñé e implementé un sistema de digitalización y organización de expedientes físicos en la nube, estructurando los archivos para permitir búsquedas de texto internas e inmediatas.",
      "Seguridad Informática: Configuré un protocolo de copias de seguridad (backups) automáticas en tiempo real en la nube y almacenamiento externo semanal, blindando la información confidencial y con valor probatorio del bufete.",
      "Soporte Técnico y Documentación: Realicé el mantenimiento preventivo y la optimización de los sistemas operativos de los equipos de la oficina, y redacté un manual de soluciones rápidas para capacitar al personal en fallas técnicas cotidianas."
    ],
  });
  console.log("Experiencia insertada.");

  // 4. Insertar Formación Académica
  await db.insert(schema.education).values({
    institution: "Universidad Libre",
    degree: "Ingeniería de sistemas",
    dateRange: "2022 - 2026",
    details: "Promedio General: 4.19 / 5.0.",
  });
  console.log("Educación insertada.");

  // 5. Insertar Habilidades
  await db.insert(schema.skills).values([
    // Idiomas
    { category: "Idioma", name: "Español", details: "Nativo" },
    { category: "Idioma", name: "Ingles", details: "Intermedio" },
    // Tecnologías
    { category: "Tecnología", name: "Lenguajes", details: "Python, JavaScript." },
    { category: "Tecnología", name: "Bases de datos", details: "SQL, PostgreSQL, MongoDB" },
    { category: "Tecnología", name: "Redes y Sistemas", details: "Configuración de redes, Git, Linux." },
    { category: "Tecnología", name: "IA", details: "automatizaciones, integraciones, creación." },
    // Habilidades Blandas
    { category: "Blanda", name: "Resolución de problemas complejos", details: null },
    { category: "Blanda", name: "Trabajo en equipo", details: null },
    { category: "Blanda", name: "Adaptabilidad", details: null },
    { category: "Blanda", name: "Rápido aprendizaje", details: null },
  ]);
  console.log("Habilidades insertadas.");

  // 6. Insertar Cursos
  await db.insert(schema.courses).values([
    { year: 2026, title: "Crear valor con IA, automatización y bots" },
    { year: 2025, title: "Carrera Profesional de Analista Junior en Ciberseguridad" },
    { year: 2025, title: "Data Analytics Essentials" },
    { year: 2025, title: "Defensa de la red" },
    { year: 2025, title: "Fundamentos de IA con IBM SkillsBuild" },
    { year: 2025, title: "Gestión de Amenazas Cibernéticas" },
    { year: 2025, title: "Introduction to Modern AI" },
    { year: 2025, title: "Introducción a la Ciberseguridad" },
    { year: 2025, title: "Introducción a la Ciencia de Datos" },
    { year: 2025, title: "Seguridad de Terminales" },
    { year: 2024, title: "Conceptos básicos de redes" },
    { year: 2024, title: "Direccionamiento de red y solución de problemas básicos" },
    { year: 2024, title: "Dispositivos de Red y Configuración Inicial" },
    { year: 2024, title: "Examen de la Carrera Profesional de Técnico en Redes" },
    { year: 2024, title: "Soporte y seguridad de red" },
  ]);
  console.log("Cursos insertados.");

  // 7. Insertar Proyectos
  await db.insert(schema.projects).values([
    {
      title: "Nexus Dashboard AI",
      description: "Un panel de control analítico impulsado por IA que predice tendencias de mercado. Interfaz construida con un diseño Glassmorphism avanzado.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
      githubUrl: "https://github.com/",
      webUrl: "https://nexus-dashboard.example.com",
      technologies: ["React", "Python", "TensorFlow", "Drizzle"]
    },
    {
      title: "Cyber Shield VPN",
      description: "Cliente VPN ligero y ultraseguro para escritorio. Cuenta con cifrado de grado militar y túneles divididos para aplicaciones específicas.",
      imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=600",
      githubUrl: "https://github.com/",
      webUrl: "https://cyber-shield.example.com",
      technologies: ["C++", "Electron", "OpenVPN"]
    },
    {
      title: "Lumina Smart Home",
      description: "App móvil para centralizar la gestión de dispositivos inteligentes IoT. Permite automatizar rutinas basadas en presencia y temperatura.",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600",
      githubUrl: "https://github.com/",
      webUrl: "https://lumina-smart.example.com",
      technologies: ["React Native", "Node.js", "Firebase", "MQTT"]
    },
    {
      title: "Quantum E-Commerce",
      description: "Plataforma de comercio electrónico de ultra alto rendimiento, capaz de soportar millones de peticiones por segundo durante ventas flash.",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=600",
      githubUrl: "https://github.com/",
      webUrl: "https://quantum-shop.example.com",
      technologies: ["Next.js", "Go", "Redis", "PostgreSQL"]
    },
    {
      title: "NeoGenetics Portal",
      description: "Portal científico para visualización interactiva de secuencias genéticas y análisis de mutaciones en tiempo real con modelado 3D.",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
      githubUrl: "https://github.com/",
      webUrl: "https://neogenetics.example.com",
      technologies: ["Vue 3", "Three.js", "Python", "Bioinformatics"]
    }
  ]);
  console.log("Proyectos insertados.");

  // 8. Insertar Usuario Admin
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);
  
  await db.insert(schema.users).values({
    username: "admin",
    passwordHash: passwordHash
  });
  console.log("Usuario admin insertado.");

  console.log("¡Todos los datos han sido guardados exitosamente en Neon!");
}

seed().catch(console.error).finally(() => process.exit(0));
