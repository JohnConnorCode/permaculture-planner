'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, AUTH_ITEMS } from '@/lib/config/app-config'
import { Leaf, Menu, X, LogIn, UserPlus } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 nature-pattern",
        isScrolled ? "glass shadow-lg border-green-200/50" : "glass-dark shadow-md border-green-300/30",
        "border-b"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover-nature transition-all duration-300 group"
            >
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-600 animate-sway group-hover:text-green-500 group-hover:animate-leaf-rustle transition-colors" />
                <div className="absolute inset-0 bg-green-400 blur-xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity" />
                <div className="absolute -inset-2 rounded-full border-organic border border-green-200/20 animate-pulse" />
              </div>
              <span className="font-bold text-xl gradient-understory bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Permaculture Planner
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 border-organic transition-all duration-300 hover-nature",
                      "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:scale-105",
                      active && "gradient-understory text-white font-medium shadow-lg border-green-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="gap-2 hover-nature border-organic hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="gap-2 gradient-understory border-organic shadow-lg hover:shadow-xl hover-lift transition-all duration-300">
                  <UserPlus className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 border-organic hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover-nature"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-green-700" />
              ) : (
                <Menu className="h-6 w-6 text-green-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden absolute top-16 left-0 right-0 glass nature-pattern border-b shadow-xl border-green-200/50",
          "transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 border-organic transition-all duration-300 hover-nature",
                    "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:scale-105",
                    active && "gradient-understory text-white font-medium shadow-lg"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-4 border-t border-green-200/50 space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full justify-center gap-2 border-organic hover-nature hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button className="w-full justify-center gap-2 gradient-understory border-organic hover-lift">
                  <UserPlus className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-16" />
    </>
  )
}