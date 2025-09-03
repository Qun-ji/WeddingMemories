import { neon } from '@neondatabase/serverless'

export default async (req, context) => {
  const sql = neon(process.env.DATABASE_URL)
  try {
    const rows = await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        text TEXT,
        image_url TEXT,
        audio_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      SELECT id, username, text, image_url, audio_url, created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT 200;
    `
    // The neon tagged template can return results for the last statement only.
    // So we need to run two queries; adjust:
  } catch (e) {
    // Retry with separate queries (safe path)
  }

  try {
    const sql2 = neon(process.env.DATABASE_URL)
    await sql2`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100),
      text TEXT,
      image_url TEXT,
      audio_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );`
    const messages = await sql2`
      SELECT id, username, text, image_url, audio_url, created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT 200;
    `
    return new Response(JSON.stringify({ messages }), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 200
    })
  } catch (err) {
    return new Response(`获取失败: ${err.message}`, { status: 500 })
  }
}
