import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { TaskContext } from '../../context/TaskContext';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high']),
  status: yup.string().oneOf(['pending', 'in-progress', 'completed']),
  dueDate: yup.string().nullable(),
}).required();

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { createTask, updateTask } = useContext(TaskContext);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      priority: 'medium',
      status: 'pending',
    }
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
      });
    }
  }, [taskToEdit, reset, isOpen]);

  const onSubmit = async (data) => {
    let success = false;
    // ensure dueDate is empty string if not provided instead of sending empty string to DB which expects Date
    if (data.dueDate === '') delete data.dueDate;

    if (taskToEdit) {
      success = await updateTask(taskToEdit._id, data);
    } else {
      success = await createTask(data);
    }

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500/20'} rounded-xl focus:ring-4 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400`}
              placeholder="e.g. Complete project proposal"
              {...register('title')}
            />
            {errors.title && <p className="text-sm text-red-500 flex items-center mt-1"><X size={14} className="mr-1"/> {errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={3}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border ${errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500/20'} rounded-xl resize-none focus:ring-4 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400`}
              placeholder="Details about the task..."
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-500 flex items-center mt-1"><X size={14} className="mr-1"/> {errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="priority">Priority</label>
              <select
                id="priority"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="status">Status</label>
              <select
                id="status"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="dueDate">Due Date (Optional)</label>
            <input
              id="dueDate"
              type="date"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
              {...register('dueDate')}
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700/60 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
