// src/lib/api.js

// 获取留言
export async function fetchMessages() {
  const res = await fetch('/.netlify/functions/getMessages', { cache: 'no-store' })
  if (!res.ok) throw new Error('获取留言失败')
  return res.json()
}

// 提交文字留言
export async function createMessage(payload) {
  const res = await fetch('/.netlify/functions/postMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || '提交失败')
  }
  return res.json()
}

// 上传文件（图片、音频等）
export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/.netlify/functions/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()  // { url: "https://xxx.upcdn.net/xxx.png" }
}
