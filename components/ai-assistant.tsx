'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bot, Send, Sparkles, Leaf, Droplets, TreePine,
  MapPin, Loader2, X, AlertCircle, ChevronUp,
  ChevronDown, Maximize2, Minimize2, HelpCircle,
  Lightbulb, Target, Brain, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  context?: any
  onSuggestion?: (suggestion: string) => void
  className?: string
}

export function AIAssistant({ context, onSuggestion, className }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your permaculture design assistant. I can help with zone planning, water harvesting, plant guilds, soil building, and more. What would you like to explore?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }])

      // Extract suggestions if present
      if (onSuggestion && data.response.includes('SUGGESTION:')) {
        const suggestion = data.response.split('SUGGESTION:')[1].split('\n')[0].trim()
        onSuggestion(suggestion)
      }

    } catch (err: any) {
      setError(err.message || 'Failed to connect to AI assistant')
      console.error('AI Assistant error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const runAnalysis = async (type: string, data: any) => {
    setIsLoading(true)
    setError(null)
    setActiveTab('chat')

    const analysisMessage: Message = {
      role: 'system',
      content: `Running ${type.replace('-', ' ')} analysis...`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, analysisMessage])

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      }])

    } catch (err: any) {
      setError('Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    { icon: Leaf, text: 'Design a food forest', category: 'design' },
    { icon: Droplets, text: 'Water harvesting advice', category: 'water' },
    { icon: TreePine, text: 'Plant guild suggestions', category: 'plants' },
    { icon: MapPin, text: 'Zone planning help', category: 'zones' },
  ]

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          size="lg"
        >
          <Bot className="h-5 w-5 mr-2" />
          AI Assistant
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <Card className={cn(
      "transition-all duration-300 shadow-xl",
      isExpanded ? "fixed inset-4 z-50" : "w-full max-w-2xl",
      className
    )}>
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            Permaculture AI Assistant
            <Badge className="bg-yellow-500 text-black">Beta</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="chat" className="flex-1">
              <Brain className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex-1">
              <Target className="h-4 w-4 mr-2" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="suggest" className="flex-1">
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="p-4 space-y-4">
            <ScrollArea
              ref={scrollRef}
              className={cn(
                "border rounded-lg p-4",
                isExpanded ? "h-[calc(100vh-400px)]" : "h-80"
              )}
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role !== 'user' && (
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        message.role === 'user'
                          ? "bg-blue-100 text-blue-900"
                          : message.role === 'system'
                          ? "bg-gray-100 text-gray-700 italic"
                          : "bg-gray-100"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {message.role === 'user' && (
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => setInput(prompt.text)}
                    className="text-xs"
                  >
                    <prompt.icon className="h-3 w-3 mr-1" />
                    {prompt.text}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask about permaculture design, zones, water systems, plant guilds..."
                  className="flex-1 min-h-[60px]"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="p-4 space-y-4">
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => runAnalysis('site-analysis', {
                  location: 'Northern California',
                  zone: '9b',
                  size: 5000,
                  slope: '5%',
                  sunExposure: 'Full sun with afternoon shade',
                  waterSource: 'Municipal + rainwater'
                })}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Analyze Current Site
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => runAnalysis('water-design', {
                  rainfall: 35,
                  size: 5000,
                  slope: 5,
                  soilType: 'Clay loam'
                })}
              >
                <Droplets className="h-4 w-4 mr-2" />
                Design Water System
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => runAnalysis('plant-guild', {
                  mainCrop: 'Apple tree',
                  zone: '9b',
                  space: 200
                })}
              >
                <TreePine className="h-4 w-4 mr-2" />
                Create Plant Guild
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => runAnalysis('yield-prediction', {
                  plants: context?.plants || [],
                  area: 5000,
                  zone: '9b',
                  waterSystem: 'Drip irrigation + swales'
                })}
              >
                <Zap className="h-4 w-4 mr-2" />
                Predict Yields
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="suggest" className="p-4 space-y-4">
            <div className="space-y-3">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  AI suggestions based on your current design
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                {[
                  'Consider adding a swale on the northern slope',
                  'Plant nitrogen-fixers near heavy feeders',
                  'Add a pond for thermal mass and biodiversity',
                  'Include more perennial vegetables',
                  'Create windbreak on western edge'
                ].map((suggestion, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <p className="text-sm">{suggestion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}