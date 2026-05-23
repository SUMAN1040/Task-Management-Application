import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';

const Dashboard = () => {
  const { tasks, loading, pagination, filters, fetchTasks, updateFilters } = useContext(TaskContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSearch = (e) => {
    updateFilters({ search: e.target.value, page: 1 });
  };

  const handleStatusFilter = (e) => {
    updateFilters({ status: e.target.value, page: 1 });
  };

  const handlePriorityFilter = (e) => {
    updateFilters({ priority: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      updateFilters({ page: newPage });
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field pl-10 py-2.5 bg-gray-50 dark:bg-gray-900 border-transparent focus:bg-white"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700 hidden sm:flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <List size={18} />
            </button>
          </div>

          <select 
            className="input-field py-2.5 w-auto text-sm"
            value={filters.status}
            onChange={handleStatusFilter}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            className="input-field py-2.5 w-auto text-sm"
            value={filters.priority}
            onChange={handlePriorityFilter}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button 
            onClick={openCreateModal}
            className="btn btn-primary py-2.5 ml-auto md:ml-0"
          >
            <Plus size={20} className="mr-1" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <Filter size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
            <p className="mt-1">Try adjusting your filters or create a new task.</p>
            <button onClick={openCreateModal} className="mt-4 text-primary-600 font-medium hover:underline">
              Create New Task
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={openEditModal} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && tasks.length > 0 && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(pagination.page - 1) * filters.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * filters.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium border border-primary-100 dark:border-primary-800/50">
              Page {pagination.page} of {pagination.pages}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={taskToEdit} 
      />
    </div>
  );
};

export default Dashboard;
