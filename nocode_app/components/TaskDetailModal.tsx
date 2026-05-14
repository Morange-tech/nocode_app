'use client';

import { useState } from 'react';
import { Task, updateTask } from '@/lib/task-service';
import { uploadAttachment, deleteAttachment } from '@/lib/storage-service';
import { X, Download, Trash, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onTasksChange: () => void;
}

export default function TaskDetailModal({
  task,
  onClose,
  onTasksChange,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.due_date?.split('T')[0] || '');
  const [dueTime, setDueTime] = useState(
    task.due_date ? task.due_date.split('T')[1]?.slice(0, 5) : ''
  );
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let attachmentUrl = task.attachment_url;

      // Handle attachment change
      if (newAttachment) {
        // Delete old attachment if exists
        if (task.attachment_url) {
          await deleteAttachment(task.attachment_url);
        }
        // Upload new attachment
        const { data, error: uploadError } = await uploadAttachment(newAttachment);
        if (uploadError) {
          setError('Failed to upload attachment');
          return;
        }
        attachmentUrl = data || undefined;
      }

      // Update task
      const dueDateTime = dueDate && dueTime ? `${dueDate}T${dueTime}` : dueDate;

      const { error: updateError } = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDateTime,
        priority,
        status,
        attachment_url: attachmentUrl,
      });

      if (updateError) {
        setError('Failed to update task');
        return;
      }

      onTasksChange();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttachment = async () => {
    if (!task.attachment_url) return;

    try {
      await deleteAttachment(task.attachment_url);
      // Trigger update to remove attachment URL
      await updateTask(task.id, { attachment_url: undefined });
      onTasksChange();
    } catch (error) {
      console.error('Error removing attachment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Current Attachment */}
          {task.attachment_url && !newAttachment && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-3">Current Attachment</p>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={task.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Replace Attachment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {task.attachment_url ? 'Replace Attachment' : 'Add Attachment'}
            </label>
            {newAttachment ? (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">{newAttachment.name}</span>
                <button
                  type="button"
                  onClick={() => setNewAttachment(null)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
                <span className="text-sm text-slate-600">Choose file</span>
                <input
                  type="file"
                  onChange={(e) => setNewAttachment(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Task Info */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 space-y-1">
            <p>Created: {format(new Date(task.created_at), 'PPpp')}</p>
            <p>Updated: {format(new Date(task.updated_at), 'PPpp')}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
