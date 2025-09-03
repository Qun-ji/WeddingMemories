export async function fetchMessages() {
  const res = await fetch('/api/messages', { cache: 'no-store' })
  if (!res.ok) throw new Error('获取留言失败')
  return res.json()
}

export async function createMessage(payload) {
  const res = await fetch('/api/messages/new', {
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

export async function uploadToCloudinary(file, { cloudName, uploadPreset, resourceType = 'image' }) {
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', uploadPreset)
  const res = await fetch(endpoint, { method: 'POST', body: form })
  if (!res.ok) throw new Error('文件上传失败')
  return res.json() // returns { secure_url, ... }
}
