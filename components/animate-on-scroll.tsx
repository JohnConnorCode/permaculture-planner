'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  animation?: string
  delay?: string
}

export function AnimateOnScroll({
  children,
  className = '',
  animation = 'animate-fade-in',
  delay = '0s'
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isVisible])

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0', // Always start invisible
        isVisible && animation, // Only add animation when visible
        className
      )}
      style={isVisible ? { animationDelay: delay, animationFillMode: 'forwards' } : {}}
    >
      {children}
    </div>
  )
}