import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Normalmente, en un proyecto Vite (frontend puro), no deberías exponer tu URL de base de datos.
// Si vas a conectarte directamente, la URL debe tener el prefijo VITE_ en el .env y accederla
// mediante import.meta.env.VITE_DATABASE_URL. Sin embargo, por seguridad, se recomienda
// que estas llamadas a la base de datos se hagan desde un backend o API, no desde el cliente.

const sql = neon(import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
