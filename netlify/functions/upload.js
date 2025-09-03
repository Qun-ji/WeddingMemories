import upyun from "upyun"

const service = new upyun.Service(
    process.env.UPYUN_BUCKET,
    process.env.UPYUN_OPERATOR,
    process.env.UPYUN_PASSWORD
)
const client = new upyun.Client(service)

export default async (req) => {
    try {
        const form = await req.formData()
        const file = form.get("file")

        if (!file) {
            return new Response("没有文件", { status: 400 })
        }

        // 把上传的文件读成 buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 存到又拍云的路径，比如 /uploads/时间戳-文件名
        const path = `/uploads/${Date.now()}-${file.name}`

        await client.putFile(path, buffer)

        // 又拍云的访问 URL
        const url = `https://${process.env.UPYUN_BUCKET}.test.upcdn.net${path}`

        return new Response(JSON.stringify({ url }), {
            headers: { "content-type": "application/json" },
            status: 200
        })
    } catch (err) {
        return new Response(`上传失败: ${err.message}`, { status: 500 })
    }
}
