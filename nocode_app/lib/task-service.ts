import { insforgeClient } from './insforge-client';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  attachment_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed';
  attachment_url?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed';
  attachment_url?: string;
}

/**
 * Get all tasks for the current user
 */
export async function getTasks(userId: string, status?: 'pending' | 'completed') {
  if (!userId) throw new Error('User ID is required');

  try {
    let query = insforgeClient
      .database
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as Task[], error: null };
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return { data: null, error: { message: error.message || 'Failed to load tasks' } };
  }
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string) {
  try {
    const { data, error } = await insforgeClient
      .database
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Task, error: null };
  } catch (error) {
    console.error('Error fetching task:', error);
    return { data: null, error };
  }
}

/**
 * Create a new task
 */
export async function createTask(
  input: CreateTaskInput,
  userId: string
) {
  try {
const { data, error } = await insforgeClient
  .database
  .from('tasks')
  .insert([
    {
      ...input,
      user_id: userId,   // ✅ ADD THIS
      status: input.status || 'pending',
    },
  ])
  .select()
  .single();

    if (error) throw error;
    return { data: data as Task, error: null };
  } catch (error) {
    console.error('Error creating task:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing task
 */
export async function updateTask(id: string, input: UpdateTaskInput) {
  try {
    const { data, error } = await insforgeClient
      .database
      .from('tasks')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Task, error: null };
  } catch (error) {
    console.error('Error updating task:', error);
    return { data: null, error };
  }
}

/**
 * Toggle task status between pending and completed
 */
export async function toggleTaskStatus(id: string) {
  try {
    const { data: task } = await getTaskById(id);
    if (!task) throw new Error('Task not found');

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    return updateTask(id, { status: newStatus });
  } catch (error) {
    console.error('Error toggling task status:', error);
    return { data: null, error };
  }
}

/**
 * Delete a task
 */
export async function deleteTask(id: string) {
  try {
    const { error } = await insforgeClient.database.from('tasks').delete().eq('id', id);

    if (error) throw error;
    return { data: null, error: null };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { data: null, error };
  }
}

/**
 * Search tasks by title (partial match)
 */
export async function searchTasks(query: string) {
  try {
    const { data, error } = await insforgeClient
      .database
      .from('tasks')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Task[], error: null };
  } catch (error) {
    console.error('Error searching tasks:', error);
    return { data: null, error };
  }
}
