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
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 flex flex-col gap-4 group relative border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isCompleted ? 'opacity-60 bg-gray-50 dark:bg-gray-800/40 grayscale-[0.2]' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button 
            onClick={toggleStatus}
            className="mt-0.5 text-gray-300 hover:text-primary-500 dark:text-gray-600 dark:hover:text-primary-400 transition-colors"
          >
            {isCompleted ? <CheckCircle2 className="text-primary-500 dark:text-primary-400" size={22} /> : <Circle size={22} />}
          </button>
          <div>
            <h3 className={`font-semibold text-[17px] text-gray-900 dark:text-white leading-tight ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${isCompleted ? 'text-primary-600 dark:text-primary-400 bg-primary-50 border-primary-100' : task.status === 'in-progress' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 border-purple-100' : 'text-gray-500'}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 dark:text-gray-500">
            <Calendar size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
