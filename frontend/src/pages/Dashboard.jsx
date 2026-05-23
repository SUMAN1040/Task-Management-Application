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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-900/80 rounded-xl p-1 ring-1 ring-gray-200 dark:ring-gray-800 hidden sm:flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <List size={18} />
            </button>
          </div>

          <select 
            className="py-2.5 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-200 text-sm cursor-pointer shadow-sm"
            value={filters.status}
            onChange={handleStatusFilter}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            className="py-2.5 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-200 text-sm cursor-pointer shadow-sm"
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
            className="flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-200 font-medium ml-auto md:ml-0"
          >
            <Plus size={18} className="mr-1.5" />
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
          <div className="flex flex-col items-center justify-center h-72 text-gray-500 dark:text-gray-400 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Filter size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No tasks found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm text-center">Try adjusting your search filters or create a new task to get started.</p>
            <button onClick={openCreateModal} className="mt-6 flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-primary-600 dark:text-primary-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">
              <Plus size={18} className="mr-1.5" />
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
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 mt-8 gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="text-gray-900 dark:text-white">{(pagination.page - 1) * filters.limit + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(pagination.page * filters.limit, pagination.total)}</span> of <span className="text-gray-900 dark:text-white">{pagination.total}</span> tasks
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1 px-2">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    pagination.page === i + 1 
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={18} />
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
