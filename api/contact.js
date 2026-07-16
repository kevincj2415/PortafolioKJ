import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dbUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    if (!dbUrl) throw new Error("Missing DATABASE_URL");

    const sql = neon(dbUrl);
    const db = drizzle(sql);

    await db.insert(schema.messages).values({
      name,
      email,
      message,
      read: false
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("API Contact Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
