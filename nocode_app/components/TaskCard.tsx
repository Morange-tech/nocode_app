'use client';

import { useState } from 'react';
import { Task, deleteTask, toggleTaskStatus } from '@/lib/task-service';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Edit, CheckCircle2, Circle, Paperclip } from 'lucide-react';
import TaskDetailModal from './TaskDetailModal';

interface TaskCardProps {
  task: Task;
  onTasksChange: () => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

export default function TaskCard({ task, onTasksChange }: TaskCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setDeleting(true);
    try {
      await deleteTask(task.id);
      onTasksChange();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setToggling(true);
    try {
      await toggleTaskStatus(task.id);
      onTasksChange();
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setToggling(false);
    }
  };

  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status === 'pending';

  return (
    <>
      <div
        className={`p-5 rounded-lg border-2 transition cursor-pointer hover:shadow-lg ${
          task.status === 'completed'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-white border-slate-200 hover:border-blue-400'
        }`}
        onClick={() => setShowDetailModal(true)}
      >
        {/* Header with Status Toggle */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <button
            onClick={handleToggleStatus}
            disabled={toggling}
            className="flex-shrink-0 mt-0.5 text-slate-400 hover:text-blue-600 transition"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold leading-tight ${
                task.status === 'completed'
                  ? 'text-slate-500 line-through'
                  : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={deleting}
            className="flex-shrink-0 text-slate-400 hover:text-red-600 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Priority & Due Date */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          {dueDate && (
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isOverdue
                  ? 'bg-red-100 text-red-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {formatDistanceToNow(dueDate, { addSuffix: true })}
            </span>
          )}

          {task.attachment_url && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              File
            </span>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetailModal(true);
          }}
          className="w-full mt-3 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Task
        </button>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetailModal(false)}
          onTasksChange={onTasksChange}
        />
      )}
    </>
  );
}
