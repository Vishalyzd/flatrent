"use client"

import { useEffect, useRef } from 'react'

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = 0.75 // Slow down the video slightly
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-traveling-through-a-tropical-forest-4k-4151-large.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text readability */}
    </div>
  )
} 