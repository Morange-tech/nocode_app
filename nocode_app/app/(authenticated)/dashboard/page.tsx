'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, Task } from '@/lib/task-service';
import { subscribeToTasks } from '@/lib/realtime-service';
import { useAuth } from '@/lib/auth-context';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import SearchFilter from '@/components/SearchFilter';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }
  }, [authLoading, user, router]);

  const loadTasks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getTasks(user.id);

    if (error) {
      console.error('Failed to load tasks:', error);
      setError('Failed to load your tasks. Please refresh the page.');
    } else {
      setTasks(data || []);
    }

    setLoading(false);
  }, [user?.id]);

  // Handlers for local state updates
  const handleTaskCreated = useCallback((newTask: Task) => {
    if (!newTask?.id) return;
    setTasks((prev) => [newTask, ...prev]);
    setShowCreateForm(false);
  }, []);

  const handleTaskUpdated = useCallback((updatedTask: Task) => {
    if (!updatedTask?.id) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const handleTaskDeleted = useCallback((deletedId: string) => {
    if (!deletedId) return;
    setTasks((prev) => prev.filter((task) => task.id !== deletedId));
  }, []);

  // Load tasks + realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    loadTasks();

    const unsubscribe = subscribeToTasks(
      user.id,
      (newTask) => handleTaskCreated(newTask),           // Use handler
      handleTaskUpdated,
      (deletedTask) => handleTaskDeleted(deletedTask?.id || '')
    );

    return () => unsubscribe();
  }, [user?.id, loadTasks, handleTaskCreated, handleTaskUpdated, handleTaskDeleted]);

  // Filtered tasks with safety checks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task): task is Task => 
      Boolean(task && task.id && task.title)
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, filterStatus, searchQuery]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Tasks Dashboard</h1>
        <p className="text-slate-600">Manage and organize your tasks</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          taskCount={filteredTasks.length}
        />

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {showCreateForm && (
        <TaskForm 
          onClose={() => setShowCreateForm(false)} 
          onTaskCreated={handleTaskCreated} 
        />
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto mb-6 h-20 w-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-semibold text-slate-900">No tasks found</h3>
          <p className="mt-2 text-slate-600">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          onTasksChange={loadTasks}
        />
      )}
    </div>
  );
}