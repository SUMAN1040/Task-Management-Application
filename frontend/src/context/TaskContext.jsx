import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', page: 1, limit: 10 });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.tasks);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      toast.success('Task created successfully');
      fetchTasks(); // Refresh list
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      return false;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await api.put(`/tasks/${id}`, taskData);
      toast.success('Task updated successfully');
      fetchTasks(); // Refresh list
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
      fetchTasks(); // Refresh list
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
      return false;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      pagination,
      filters,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      updateFilters
    }}>
      {children}
    </TaskContext.Provider>
  );
};
