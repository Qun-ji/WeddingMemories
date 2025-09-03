import { neon } from '@neondatabase/serverless'

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const { username, text, imageUrl, audioUrl } = await req.json().catch(() => ({}))
  if (!text && !imageUrl && !audioUrl) {
    return new Response('至少需要提供文字/图片/录音之一', { status: 400 })
  }
  const sql = neon(process.env.DATABASE_URL)
  try {
    await sql`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100),
      text TEXT,
      image_url TEXT,
      audio_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );`
    const rows = await sql`
      INSERT INTO messages (username, text, image_url, audio_url)
      VALUES (${username || null}, ${text || null}, ${imageUrl || null}, ${audioUrl || null})
      RETURNING id, username, text, image_url, audio_url, created_at;
    `
    const message = rows[0]
    return new Response(JSON.stringify({ message }), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 200
    })
  } catch (err) {
    return new Response(`写入失败: ${err.message}`, { status: 500 })
  }
}
