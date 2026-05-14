'use client';

import { Task } from '@/lib/task-service';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: () => void;
}

export default function TaskList({ tasks, onTasksChange }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onTasksChange={onTasksChange} />
      ))}
    </div>
  );
}
