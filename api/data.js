import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dbUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    if (!dbUrl) throw new Error("Missing DATABASE_URL");

    const sql = neon(dbUrl);
    const db = drizzle(sql, { schema });

    const [profile, experience, education, skills, courses, projects] = await Promise.all([
      db.select().from(schema.profile),
      db.select().from(schema.experience),
      db.select().from(schema.education),
      db.select().from(schema.skills),
      db.select().from(schema.courses),
      db.select().from(schema.projects)
    ]);

    res.status(200).json({
      profile: profile[0],
      experience,
      education,
      skills,
      courses: courses.sort((a, b) => b.year - a.year),
      projects
    });
  } catch (error) {
    console.error("API Data Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
