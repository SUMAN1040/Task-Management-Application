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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className={`input-field px-4 py-2.5 ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g. Complete project proposal"
              {...register('title')}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={3}
              className={`input-field px-4 py-2.5 resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Details about the task..."
              {...register('description')}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                className="input-field px-4 py-2.5"
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="status">Status</label>
              <select
                id="status"
                className="input-field px-4 py-2.5"
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="dueDate">Due Date (Optional)</label>
            <input
              id="dueDate"
              type="date"
              className="input-field px-4 py-2.5"
              {...register('dueDate')}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
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
