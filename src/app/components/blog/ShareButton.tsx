"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
  title: string
  description: string
  url: string
}

export default function ShareButton({ title, description, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-accent hover:text-yellow-600 transition-colors"
    >
      <Share2 className="w-5 h-5" />
      <span className="text-sm font-semibold">
        {copied ? "¡Copiado!" : "Compartir"}
      </span>
    </button>
  )
}
