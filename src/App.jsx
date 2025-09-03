import React from 'react'
import Countdown from './components/Countdown.jsx'
import Gallery from './components/Gallery.jsx'
import MessageWall from './components/MessageWall.jsx'

const WEDDING_DATE = import.meta.env.VITE_WEDDING_DATE || '2025-10-01T10:00:00'
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_UNSIGNED_PRESET = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET || ''

export default function App() {
  // 示例相册（上线后可改为从 Cloudinary 的一个文件夹拉取或手动替换为你们的图）
  const images = [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
    "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4"
  ]

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1 className="title">Alice ❤️ Bob</h1>
          <p className="subtitle">Wedding Day · {new Date(WEDDING_DATE).toLocaleDateString()}</p>
          <div style={{marginTop: 12}}>
            <Countdown dateISO={WEDDING_DATE} />
          </div>
        </div>
      </header>

      <section className="container section">
        <h3>婚纱照精选</h3>
        <p className="subtitle">来自我们的甜蜜瞬间</p>
        <Gallery images={images} />
      </section>

      <section className="container section">
        <MessageWall cloudName={CLOUDINARY_CLOUD_NAME} uploadPreset={CLOUDINARY_UNSIGNED_PRESET} />
      </section>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} With love — 永远在一起
        </div>
      </footer>
    </div>
  )
}
