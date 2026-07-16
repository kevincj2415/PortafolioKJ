import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import * as schema from '../src/db/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const dbUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    if (!dbUrl) throw new Error("Missing DATABASE_URL");

    const sql = neon(dbUrl);
    const db = drizzle(sql, { schema });

    const result = await db.select().from(schema.users);
    const adminUser = result.find(u => u.username === 'admin');

    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
      if (isMatch) {
        res.status(200).json({ success: true, token: 'kjgc_admin_secured' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("API Auth Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
