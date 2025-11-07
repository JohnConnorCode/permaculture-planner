/**
 * Task Synchronization with Supabase
 *
 * Saves generated tasks from seasonal timeline to database
 */

import { SupabaseClient } from '@supabase/supabase-js'

interface GeneratedTask {
  title: string
  description: string
  category: 'build' | 'plant' | 'maintain' | 'harvest' | 'water' | 'fertilize'
  due_on: string // ISO date
  notes: string
}

interface DatabaseTask {
  id?: string
  plan_id: string
  title: string
  due_on: string
  category: 'build' | 'plant' | 'water' | 'cover' | 'harvest' | 'maint'
  completed?: boolean
}

/**
 * Map generated task categories to database categories
 */
function mapCategory(category: GeneratedTask['category']): DatabaseTask['category'] {
  const mapping: Record<GeneratedTask['category'], DatabaseTask['category']> = {
    build: 'build',
    plant: 'plant',
    water: 'water',
    harvest: 'harvest',
    maintain: 'maint',
    fertilize: 'maint',
  }
  return mapping[category]
}

/**
 * Save generated tasks to Supabase
 *
 * This function:
 * 1. Maps generated tasks to database schema
 * 2. Removes duplicate tasks (same title + due date)
 * 3. Preserves completed status of existing tasks
 * 4. Inserts new tasks
 *
 * @param supabase - Supabase client
 * @param planId - Plan ID to associate tasks with
 * @param generatedTasks - Tasks from seasonal timeline
 * @returns Success status and error message if failed
 */
export async function syncTasksToSupabase(
  supabase: SupabaseClient,
  planId: string,
  generatedTasks: GeneratedTask[]
): Promise<{ success: boolean; error?: string; tasksCreated?: number }> {
  try {
    // 1. Fetch existing tasks for this plan
    const { data: existingTasks, error: fetchError } = await (supabase as any)
      .from('tasks')
      .select('*')
      .eq('plan_id', planId)

    if (fetchError) {
      console.error('Error fetching existing tasks:', fetchError)
      return { success: false, error: fetchError.message }
    }

    // 2. Create a set of existing task keys (title + due_on)
    const existingTaskKeys = new Set(
      (existingTasks || []).map((task: any) => `${task.title}|${task.due_on}`)
    )

    // 3. Filter out tasks that already exist
    const newTasks: DatabaseTask[] = generatedTasks
      .filter((task) => {
        const key = `${task.title}|${task.due_on}`
        return !existingTaskKeys.has(key)
      })
      .map((task) => ({
        plan_id: planId,
        title: task.title,
        due_on: task.due_on,
        category: mapCategory(task.category),
        completed: false,
      }))

    // 4. Insert new tasks (if any)
    if (newTasks.length > 0) {
      const { error: insertError } = await (supabase as any)
        .from('tasks')
        .insert(newTasks)

      if (insertError) {
        console.error('Error inserting tasks:', insertError)
        return { success: false, error: insertError.message }
      }

      console.log(`✅ Created ${newTasks.length} new tasks`)
      return { success: true, tasksCreated: newTasks.length }
    }

    // No new tasks to create
    return { success: true, tasksCreated: 0 }
  } catch (error) {
    console.error('Error syncing tasks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Delete all tasks for a plan
 *
 * Useful for resetting the task list when regenerating
 */
export async function clearTasksForPlan(
  supabase: SupabaseClient,
  planId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('tasks')
      .delete()
      .eq('plan_id', planId)

    if (error) {
      console.error('Error clearing tasks:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error clearing tasks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get all tasks for a plan
 */
export async function getTasksForPlan(
  supabase: SupabaseClient,
  planId: string
): Promise<{ success: boolean; tasks?: DatabaseTask[]; error?: string }> {
  try {
    const { data: tasks, error } = await (supabase as any)
      .from('tasks')
      .select('*')
      .eq('plan_id', planId)
      .order('due_on', { ascending: true })

    if (error) {
      console.error('Error fetching tasks:', error)
      return { success: false, error: error.message }
    }

    return { success: true, tasks: tasks || [] }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
