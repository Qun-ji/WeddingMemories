# Wedding Memorial Site (Netlify + Neon + Cloudinary)

一个可直接部署的婚礼纪念网站：
- Netlify 托管前端 + Functions
- Neon (Postgres) 存留言（文字 + 图片URL + 录音URL）
- Cloudinary 进行前端**无密钥**上传（使用 unsigned upload preset）
- 实时婚礼倒计时（>48h 显示天数，否则显示小时；婚礼后显示「已结婚天数」）

## 本地开发
```bash
npm install
npm run dev
```

将 `.env.example` 复制为 `.env` 并填写：
- `VITE_WEDDING_DATE` 婚礼日期（ISO，如 `2025-10-01T10:00:00`）
- `VITE_CLOUDINARY_CLOUD_NAME` 你的 Cloudinary Cloud Name
- `VITE_CLOUDINARY_UNSIGNED_PRESET` 你的 unsigned 上传 preset 名称

将以下环境变量配置到 Netlify 项目 Settings → Environment variables：
- `DATABASE_URL` 你的 Neon 连接串（例如：`postgres://...`）

## 部署到 Netlify
- 连接你的 Git 仓库后自动构建
- 确保 `netlify.toml` 存在（已配置 functions 和 API 路由）
- 设置环境变量 `DATABASE_URL`

## 数据库表
Functions 会按需自动创建表：
```sql
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  text TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Cloudinary 配置
- 创建一个 **Unsigned Upload Preset**（限制来源/文件大小/格式以保证安全）
- 在前端通过 `VITE_CLOUDINARY_CLOUD_NAME` 和 `VITE_CLOUDINARY_UNSIGNED_PRESET` 使用直传
- 图片以 `resourceType=image` 上传；音频以 `resourceType=video` 上传（Cloudinary 将音频归为 video 资源类型）

## 常见问题
- 如果留言无法保存，请检查 Netlify 环境变量 `DATABASE_URL` 是否正确
- 如果上传失败，请检查 Cloudinary 的 cloud name/preset，或网络请求的 CORS
- 预设图片来自 Unsplash 占位图，换成你们的真实婚纱照即可

祝幸福！
