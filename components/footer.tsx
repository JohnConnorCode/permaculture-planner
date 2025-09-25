import Link from 'next/link'
import { Leaf, Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-green-50 to-emerald-50 border-t border-green-200/50 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-600" />
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30" />
              </div>
              <span className="font-bold text-xl text-gray-900">
                Permaculture Planner
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Design sustainable gardens with AI-powered permaculture planning.
              Free and open source for everyone.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-700" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-700" />
              </a>
              <a
                href="mailto:contact@permaculture-planner.com"
                className="p-2 rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-green-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-600 hover:text-green-600 transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/wizard" className="text-gray-600 hover:text-green-600 transition-colors">
                  Garden Wizard
                </Link>
              </li>
              <li>
                <Link href="/editor" className="text-gray-600 hover:text-green-600 transition-colors">
                  Visual Designer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-green-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-green-600 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-green-600 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/permaculture-planner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Open Source
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-200/50 bg-white/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} Permaculture Planner. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> for sustainable gardening
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}