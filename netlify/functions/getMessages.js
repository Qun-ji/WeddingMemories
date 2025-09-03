import { neon } from '@neondatabase/serverless'

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 先保证表存在
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        text TEXT,
        image_url TEXT,
        audio_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // 再查数据
    const messages = await sql`
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
