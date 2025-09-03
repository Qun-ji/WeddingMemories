// 获取留言
export async function fetchMessages() {
  const res = await fetch('/.netlify/functions/getMessages', { cache: 'no-store' })
  if (!res.ok) throw new Error('获取留言失败')
  return res.json()
}

// 创建留言（文字、图片、音频的URL存数据库）
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

// 上传文件到又拍云（替换掉 Cloudinary）
export async function uploadFile(file) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch('/.netlify/functions/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || '上传失败')
  }

  const data = await res.json()
  return data.url   // 又拍云返回的外链地址
}
