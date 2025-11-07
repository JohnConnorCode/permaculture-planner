'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineControlsProps {
  currentMonth: number
  totalMonths: number
  isPlaying: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onSeek: (month: number) => void
  onSpeedChange: (speed: number) => void
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const SEASON_COLORS = {
  spring: 'bg-green-100 text-green-800 border-green-300',
  summer: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  fall: 'bg-orange-100 text-orange-800 border-orange-300',
  winter: 'bg-blue-100 text-blue-800 border-blue-300',
}

function getSeason(month: number): keyof typeof SEASON_COLORS {
  const seasonMonth = month % 12
  if (seasonMonth >= 2 && seasonMonth <= 4) return 'spring'
  if (seasonMonth >= 5 && seasonMonth <= 7) return 'summer'
  if (seasonMonth >= 8 && seasonMonth <= 10) return 'fall'
  return 'winter'
}

export function TimelineControls({
  currentMonth,
  totalMonths,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSeek,
  onSpeedChange,
}: TimelineControlsProps) {
  const year = Math.floor(currentMonth / 12)
  const month = currentMonth % 12
  const season = getSeason(currentMonth)
  const progress = (currentMonth / totalMonths) * 100

  const handleSliderChange = (value: number[]) => {
    onSeek(value[0])
  }

  const skipForward = () => {
    onSeek(Math.min(currentMonth + 12, totalMonths))
  }

  const skipBackward = () => {
    onSeek(Math.max(currentMonth - 12, 0))
  }

  return (
    <div className="space-y-4">
      {/* Timeline slider */}
      <div className="space-y-2">
        <Slider
          value={[currentMonth]}
          onValueChange={handleSliderChange}
          min={0}
          max={totalMonths}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Start</span>
          <span>Year {Math.floor(totalMonths / 24)}</span>
          <span>Year {Math.floor(totalMonths / 12)}</span>
        </div>
      </div>

      {/* Current time display */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">
            Year {year}, {MONTH_NAMES[month]}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Month {currentMonth} of {totalMonths}
          </div>
        </div>
        <Badge variant="outline" className={SEASON_COLORS[season]}>
          {season.charAt(0).toUpperCase() + season.slice(1)}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            season === 'spring' && 'bg-green-500',
            season === 'summer' && 'bg-yellow-500',
            season === 'fall' && 'bg-orange-500',
            season === 'winter' && 'bg-blue-500'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          title="Reset to start"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={skipBackward}
          title="Back 1 year"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          size="lg"
          onClick={isPlaying ? onPause : onPlay}
          className={cn(
            'w-20',
            isPlaying && 'bg-red-600 hover:bg-red-700'
          )}
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Play
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={skipForward}
          title="Forward 1 year"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Select
          value={speed.toString()}
          onValueChange={(v) => onSpeedChange(parseFloat(v))}
        >
          <SelectTrigger className="w-[100px]">
            <FastForward className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
            <SelectItem value="5">5x</SelectItem>
            <SelectItem value="10">10x</SelectItem>
            <SelectItem value="50">50x</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Speed indicator */}
      <div className="text-center text-sm text-muted-foreground">
        {isPlaying && (
          <span>
            Simulating at {speed}x speed
            {speed >= 10 && ' • Fast mode'}
          </span>
        )}
        {!isPlaying && <span>Paused • Use slider to explore timeline</span>}
      </div>
    </div>
  )
}
