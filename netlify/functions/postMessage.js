import { neon } from '@neondatabase/serverless'

export default async (req) => {
  try {
    const body = await req.json()
    const { username, text, image_url, audio_url } = body

    const sql = neon(process.env.DATABASE_URL)

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

    const rows = await sql`
      INSERT INTO messages (username, text, image_url, audio_url)
      VALUES (${username}, ${text}, ${image_url}, ${audio_url})
      RETURNING *;
    `

    return new Response(JSON.stringify(rows[0]), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 200
    })
  } catch (err) {
    return new Response(`提交失败: ${err.message}`, { status: 500 })
  }
}
