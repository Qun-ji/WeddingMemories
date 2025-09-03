export default async (req, context) => {
  try {
    const form = await req.formData()
    const file = form.get("file")

    // 转换为 Buffer 传给又拍云
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const upyunRes = await fetch(`https://v0.api.upyun.com/${process.env.UPYUN_BUCKET}/${file.name}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.UPYUN_OPERATOR + ":" + process.env.UPYUN_PASSWORD).toString("base64"),
        "Content-Length": buffer.length
      },
      body: buffer
    })

    if (!upyunRes.ok) {
      throw new Error(await upyunRes.text())
    }

    const url = `https://${process.env.UPYUN_DOMAIN}/${file.name}`

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  } catch (err) {
    return new Response(`上传失败: ${err.message}`, { status: 500 })
  }
}
