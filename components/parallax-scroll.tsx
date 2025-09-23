'use client'

import { useEffect, useState, ReactNode } from 'react'

interface ParallaxScrollProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  className = ''
}: ParallaxScrollProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${offset * speed}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  )
}