import React, { useEffect, useState } from 'react'

function formatCountdown(targetDate) {
  const now = new Date()
  const diffMs = targetDate - now

  if (diffMs > 0) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (hours <= 48) {
      return `婚礼倒计时：${hours} 小时`
    }
    return `婚礼倒计时：${days} 天`
  } else {
    const pastDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24))
    return `我们已结婚 ${pastDays} 天`
  }
}

export default function Countdown({ dateISO }) {
  const [text, setText] = useState('')

  useEffect(() => {
    const target = new Date(dateISO)
    const update = () => setText(formatCountdown(target))
    update()
    const timer = setInterval(update, 60 * 1000) // 每分钟更新
    return () => clearInterval(timer)
  }, [dateISO])

  return <span className="countdown">{text}</span>
}
