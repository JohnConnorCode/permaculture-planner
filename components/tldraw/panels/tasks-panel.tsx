'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ListTodo,
  CheckCircle2,
  Circle,
  Sprout,
  Droplets,
  Hammer,
  Leaf,
  AlertCircle,
  Calendar,
  Filter,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TasksPanelProps {
  /** Plan ID for loading tasks */
  planId?: string
}

interface Task {
  id: string
  plan_id: string
  title: string
  due_on: string
  category: 'build' | 'plant' | 'water' | 'cover' | 'harvest' | 'maint'
  completed: boolean
}

/**
 * TasksPanel - Displays and manages garden tasks
 *
 * Features:
 * - Load tasks from database
 * - Mark tasks complete/incomplete
 * - Filter by category
 * - Highlight overdue tasks
 * - Sort by due date
 */
export function TasksPanel({ planId }: TasksPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const supabase = createClient()

  // Load tasks from database
  useEffect(() => {
    if (!planId) {
      setLoading(false)
      return
    }

    loadTasks()
  }, [planId])

  const loadTasks = async () => {
    if (!planId) return

    try {
      const { data, error } = await (supabase as any)
        .from('tasks')
        .select('*')
        .eq('plan_id', planId)
        .order('due_on', { ascending: true })

      if (error) throw error

      setTasks(data || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Toggle task completion
  const handleToggleComplete = async (taskId: string, currentCompleted: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ completed: !currentCompleted })
        .eq('id', taskId)

      if (error) throw error

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !currentCompleted } : task
        )
      )

      toast.success(!currentCompleted ? 'Task completed!' : 'Task marked incomplete')
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  // Filter and categorize tasks
  const { upcoming, overdue, completed } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let filteredTasks = tasks
    if (filterCategory !== 'all') {
      filteredTasks = tasks.filter(task => task.category === filterCategory)
    }

    const upcomingTasks: Task[] = []
    const overdueTasks: Task[] = []
    const completedTasks: Task[] = []

    filteredTasks.forEach(task => {
      const dueDate = new Date(task.due_on)
      dueDate.setHours(0, 0, 0, 0)

      if (task.completed) {
        completedTasks.push(task)
      } else if (dueDate < today) {
        overdueTasks.push(task)
      } else {
        upcomingTasks.push(task)
      }
    })

    return {
      upcoming: upcomingTasks,
      overdue: overdueTasks,
      completed: completedTasks,
    }
  }, [tasks, filterCategory])

  const categories = [
    { value: 'all', label: 'All', icon: ListTodo },
    { value: 'plant', label: 'Plant', icon: Sprout },
    { value: 'water', label: 'Water', icon: Droplets },
    { value: 'harvest', label: 'Harvest', icon: Leaf },
    { value: 'build', label: 'Build', icon: Hammer },
    { value: 'maint', label: 'Maintain', icon: Circle },
  ]

  const hasContent = tasks.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-green-600" />
            Tasks
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            {tasks.filter(t => !t.completed).length} active
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Track your garden activities and planting schedule
        </p>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium">Filter by category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon
            const isActive = filterCategory === cat.value
            return (
              <Button
                key={cat.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat.value)}
                className="text-xs h-7"
              >
                <Icon className="h-3 w-3 mr-1" />
                {cat.label}
              </Button>
            )
          })}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {loading && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            </div>
          )}

          {!loading && !hasContent && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <ListTodo className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  No tasks yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Go to the Calendar tab and click &quot;Generate Tasks&quot; to create a planting schedule
                </p>
              </CardContent>
            </Card>
          )}

          {/* Overdue Tasks */}
          {overdue.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-600">
                  Overdue ({overdue.length})
                </h3>
              </div>
              <div className="space-y-2">
                {overdue.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleComplete}
                    variant="overdue"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          {upcoming.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-green-600" />
                <h3 className="text-sm font-semibold">
                  Upcoming ({upcoming.length})
                </h3>
              </div>
              <div className="space-y-2">
                {upcoming.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleComplete}
                    variant="upcoming"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Completed ({completed.length})
                </h3>
              </div>
              <div className="space-y-2">
                {completed.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleComplete}
                    variant="completed"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface TaskCardProps {
  task: Task
  onToggle: (taskId: string, currentCompleted: boolean) => void
  variant: 'overdue' | 'upcoming' | 'completed'
}

function TaskCard({ task, onToggle, variant }: TaskCardProps) {
  const categoryColors = {
    plant: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    water: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    harvest: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    build: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    maint: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    cover: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  }

  const variantClasses = {
    overdue: 'border-red-200 bg-red-50 dark:bg-red-950/20',
    upcoming: 'border-border',
    completed: 'opacity-60',
  }

  const dueDate = new Date(task.due_on)
  const isToday =
    dueDate.toDateString() === new Date().toDateString()

  return (
    <Card className={cn('transition-all', variantClasses[variant])}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id, task.completed)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  task.completed && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn('text-xs', categoryColors[task.category])}>
                {task.category}
              </Badge>
              <span
                className={cn(
                  'text-xs',
                  variant === 'overdue'
                    ? 'text-red-600 font-medium'
                    : isToday
                    ? 'text-green-600 font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {isToday
                  ? 'Today'
                  : dueDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
