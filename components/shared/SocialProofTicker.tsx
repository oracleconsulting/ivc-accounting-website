import { useEffect, useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

const messages = [
  "Sarah from London just saved £12k on taxes",
  "Tech startup in Manchester joined our fight",
  "3 spots remaining for January",
  "James helped secure £500k in R&D credits",
  "PE firm blocked - business owner protected",
  "47 happy clients and counting",
  "Latest client saved 32% on tax bill",
  "New growth strategy launched for client"
]

export default function SocialProofTicker() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const { trackSocial } = useAnalytics()

  useEffect(() => {
    const interval = setInterval(() => {
      const nextMessage = (currentMessage + 1) % messages.length
      setCurrentMessage(nextMessage)
      trackSocial(`message_${nextMessage + 1}`)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentMessage, trackSocial])

  return (
    <div 
      className="fixed top-20 right-4 z-40 max-w-xs bg-[#1a2b4a] text-[#f5f1e8] p-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105"
      onClick={() => trackSocial('ticker_click')}
    >
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse" />
        <p className="text-sm font-medium">{messages[currentMessage]}</p>
      </div>
    </div>
  )
} 