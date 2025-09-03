import React from 'react'

export default function Gallery({ images = [] }) {
  if (!images.length) {
    return <p className="subtitle">相册还在准备中，敬请期待～</p>
  }
  return (
    <div className="grid">
      {images.map((url, idx) => (
        <div className="card" key={idx}>
          <img src={url} alt={`wedding-${idx}`} loading="lazy" />
        </div>
      ))}
    </div>
  )
}
