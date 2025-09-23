'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Code, BookOpen, GitBranch, TestTube, MessageSquare, Users,
  ArrowRight, Github, Copy, Check, FileCode, Terminal,
  Palette, Database, Globe, Zap, Package, Bug
} from 'lucide-react'

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Developer Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Join us in building open-source tools that empower people to grow food sustainably.
            Every contribution helps make permaculture accessible to more gardeners worldwide.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 opacity-0 animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-green-600" />
              Quick Start
            </CardTitle>
            <CardDescription>Get the project running locally in 5 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 relative">
              <code className="text-green-400 text-sm">
                <div className="mb-2">
                  <span className="text-gray-500"># Clone the repository</span>
                </div>
                <div className="mb-2">git clone https://github.com/JohnConnorCode/permaculture-planner.git</div>
                <div className="mb-2">cd permaculture-planner</div>
                <div className="mb-2">
                  <span className="text-gray-500"># Install dependencies</span>
                </div>
                <div className="mb-2">npm install</div>
                <div className="mb-2">
                  <span className="text-gray-500"># Set up environment variables</span>
                </div>
                <div className="mb-2">cp .env.example .env.local</div>
                <div className="mb-2">
                  <span className="text-gray-500"># Run development server</span>
                </div>
                <div>npm run dev</div>
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(
                  'git clone https://github.com/JohnConnorCode/permaculture-planner.git\ncd permaculture-planner\nnpm install\ncp .env.example .env.local\nnpm run dev',
                  'quickstart'
                )}
              >
                {copiedCode === 'quickstart' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contribution Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Code,
              title: "Code Contributions",
              description: "Add features, fix bugs, improve performance",
              items: [
                "New garden layout algorithms",
                "Crop database expansions",
                "Mobile responsiveness",
                "Offline mode improvements"
              ]
            },
            {
              icon: Palette,
              title: "Design & UX",
              description: "Improve the user experience and interface",
              items: [
                "UI component improvements",
                "Accessibility features",
                "Mobile app designs",
                "User flow optimization"
              ]
            },
            {
              icon: Database,
              title: "Data & Science",
              description: "Enhance our permaculture knowledge base",
              items: [
                "Crop companion data",
                "Climate zone mappings",
                "Pest management info",
                "Soil science data"
              ]
            },
            {
              icon: Globe,
              title: "Localization",
              description: "Help gardeners in your region",
              items: [
                "Translate the interface",
                "Add regional crops",
                "Local climate data",
                "Cultural practices"
              ]
            },
            {
              icon: TestTube,
              title: "Testing",
              description: "Ensure reliability and quality",
              items: [
                "Write unit tests",
                "E2E test scenarios",
                "Performance testing",
                "Bug reporting"
              ]
            },
            {
              icon: BookOpen,
              title: "Documentation",
              description: "Help others understand and contribute",
              items: [
                "API documentation",
                "User guides",
                "Video tutorials",
                "Example gardens"
              ]
            }
          ].map((area, index) => (
            <Card key={index} className="hover-lift">
              <CardHeader>
                <div className="p-2 bg-green-100 rounded-lg w-fit mb-2">
                  <area.icon className="h-6 w-6 text-green-700" />
                </div>
                <CardTitle className="text-lg">{area.title}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  {area.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6 text-green-600" />
              Tech Stack
            </CardTitle>
            <CardDescription>Built with modern, developer-friendly technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Frontend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Next.js 14</span>
                    <span className="text-gray-500">App Router</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>TypeScript</span>
                    <span className="text-gray-500">Type Safety</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Tailwind CSS</span>
                    <span className="text-gray-500">Styling</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Zustand</span>
                    <span className="text-gray-500">State Management</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Backend & Tools</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Supabase</span>
                    <span className="text-gray-500">Database & Auth</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>PostgreSQL</span>
                    <span className="text-gray-500">Data Storage</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Playwright</span>
                    <span className="text-gray-500">E2E Testing</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Vercel</span>
                    <span className="text-gray-500">Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Workflow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <GitBranch className="h-6 w-6 text-green-600" />
              Development Workflow
            </CardTitle>
            <CardDescription>How to contribute code effectively</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Fork & Create Branch</h4>
                  <p className="text-sm text-gray-600">Fork the repo and create a feature branch from main</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                    git checkout -b feature/your-feature-name
                  </code>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Write Tests</h4>
                  <p className="text-sm text-gray-600">Add tests for your changes</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                    npm run test
                  </code>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Submit Pull Request</h4>
                  <p className="text-sm text-gray-600">Open a PR with a clear description of changes</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Code Review</h4>
                  <p className="text-sm text-gray-600">Address feedback and iterate</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Issue Guidelines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bug className="h-6 w-6 text-green-600" />
              Reporting Issues
            </CardTitle>
            <CardDescription>Help us improve by reporting bugs and suggesting features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Bug Reports</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  <li>• Clear description of the issue</li>
                  <li>• Steps to reproduce</li>
                  <li>• Expected vs actual behavior</li>
                  <li>• Screenshots if applicable</li>
                  <li>• Browser and OS information</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Feature Requests</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Problem you're trying to solve</li>
                  <li>• Proposed solution</li>
                  <li>• Alternative solutions considered</li>
                  <li>• Additional context</li>
                  <li>• Mockups or examples</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Every contribution, no matter how small, helps make sustainable gardening
            accessible to more people around the world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://github.com/JohnConnorCode/permaculture-planner" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gradient-green text-white hover-lift">
                <Github className="h-5 w-5 mr-2" />
                View on GitHub
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/community">
              <Button size="lg" variant="outline" className="hover-lift">
                <MessageSquare className="h-5 w-5 mr-2" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}