'use client'

export default function TestAnimations() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Animation Test Page</h1>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded opacity-0 animate-fade-in">
          1. Fade in (should appear with fade)
        </div>

        <div className="p-4 bg-white rounded opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          2. Fade in with 0.5s delay
        </div>

        <div className="p-4 bg-white rounded opacity-0 animate-slide-in-left" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          3. Slide in from left with 1s delay
        </div>

        <div className="p-4 bg-white rounded opacity-0 animate-slide-in-right" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          4. Slide in from right with 1.5s delay
        </div>

        <div className="p-4 bg-white rounded opacity-0 animate-scale-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
          5. Scale in with 2s delay
        </div>
      </div>
    </div>
  )
}