import { pgTable, serial, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

// Perfil e información básica
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  about: text("about").notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  location: varchar("location", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
});

// Experiencia Laboral
export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  dateRange: varchar("date_range", { length: 100 }),
  // Guardaremos los puntos (logros/tareas) como un array de JSON
  achievements: jsonb("achievements").notNull(),
});

// Formación Académica
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  dateRange: varchar("date_range", { length: 100 }),
  details: text("details"),
});

// Habilidades (Idiomas, Tecnologías, Blandas)
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(), // 'Idioma', 'Tecnología', 'Blanda'
  name: varchar("name", { length: 255 }).notNull(),
  details: text("details"), // Ej: 'Nativo', 'Python, JavaScript', etc.
});

// Cursos
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
});

// Proyectos
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  webUrl: varchar("web_url", { length: 255 }),
  technologies: jsonb("technologies").notNull(),
});

// Usuarios (Autenticación Dashboard)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

// Mensajes de contacto
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
