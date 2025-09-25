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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur shadow-lg" : "bg-white/90 backdrop-blur-sm",
        "border-b border-gray-200"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group"
            >
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-600 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <span className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors duration-300">
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
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden group",
                      "hover:bg-green-50 hover:text-green-700 hover:shadow-md",
                      active && "bg-green-100 text-green-700 font-medium shadow-sm"
                    )}
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                )
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-green-50">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                  <UserPlus className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover-nature min-w-[44px] min-h-[44px] flex items-center justify-center"
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
          "md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-xl z-40",
          "transition-all duration-300",
          isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="container mx-auto px-4 py-6 space-y-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 rounded-lg transition-all duration-300 hover-nature min-h-[44px]",
                    "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 touch-target-44",
                    active && "gradient-understory text-white font-medium shadow-lg"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-base">{item.label}</span>
                </Link>
              )
            })}
            <div className="pt-4 border-t border-green-200/50 space-y-3">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full justify-center gap-2 rounded-lg hover-nature hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 h-12 text-base">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button className="w-full justify-center gap-2 gradient-understory rounded-lg hover-lift h-12 text-base">
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