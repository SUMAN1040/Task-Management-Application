import React, { useContext } from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { TaskContext } from '../../context/TaskContext';

const TaskCard = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useContext(TaskContext);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50',
  };

  const isCompleted = task.status === 'completed';

  const toggleStatus = () => {
    updateTask(task._id, { status: isCompleted ? 'pending' : 'completed' });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task._id);
    }
  };

  return (
    <div className={`card p-5 flex flex-col gap-3 group relative ${isCompleted ? 'opacity-70 grayscale-[0.2]' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button 
            onClick={toggleStatus}
            className="mt-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {isCompleted ? <CheckCircle2 className="text-primary-500" /> : <Circle />}
          </button>
          <div>
            <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className={`text-xs font-medium ${isCompleted ? 'text-primary-600 dark:text-primary-400' : task.status === 'in-progress' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
            {task.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
