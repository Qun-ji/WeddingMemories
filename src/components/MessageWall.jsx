import React, { useEffect, useState } from 'react'
import { fetchMessages, createMessage, uploadToCloudinary } from '../lib/api.js'

export default function MessageWall({ cloudName, uploadPreset }) {
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const data = await fetchMessages()
      setMessages(data.messages || [])
    } catch (e) {
      console.error(e)
      setError(String(e.message || e))
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      let imageUrl = ''
      let audioUrl = ''
      if (imageFile) {
        const r = await uploadToCloudinary(imageFile, { cloudName, uploadPreset, resourceType: 'image' })
        imageUrl = r.secure_url
      }
      if (audioFile) {
        const r = await uploadToCloudinary(audioFile, { cloudName, uploadPreset, resourceType: 'video' })
        audioUrl = r.secure_url
      }
      await createMessage({ username, text, imageUrl, audioUrl })
      setUsername(''); setText(''); setImageFile(null); setAudioFile(null)
      await load()
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h3>留言墙</h3>
      <form className="form" onSubmit={onSubmit}>
        <div className="row">
          <input className="input" placeholder="昵称（可留空）"
                 value={username} onChange={e => setUsername(e.target.value)} />
          <span className="badge">支持图片/语音上传</span>
        </div>
        <textarea className="textarea" placeholder="写下你的祝福…"
                  value={text} onChange={e => setText(e.target.value)} />
        <div className="row">
          <input className="file" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          <input className="file" type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} />
        </div>
        <button className="button" disabled={submitting}>{submitting ? '提交中…' : '提交留言'}</button>
        {error && <div style={{color: 'crimson'}}>{error}</div>}
      </form>

      <hr className="sep" />

      <div>
        {messages.map(m => (
          <div className="message" key={m.id}>
            <div className="flex">
              <strong>{m.username || '匿名'}</strong>
              <span className="meta">{new Date(m.created_at).toLocaleString()}</span>
            </div>
            {m.text && <div>{m.text}</div>}
            <div className="media">
              {m.image_url && <img src={m.image_url} alt="img" style={{maxWidth: '100%', borderRadius: 12}} />}
              {m.audio_url && <audio controls src={m.audio_url} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
