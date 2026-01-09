'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData, TaskFilter } from '@/types';
import { taskApi, ApiError } from '@/lib/api';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  searchTerm: string;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
  setSearchTerm: (term: string) => void;
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<TaskFilter>('all');
  const [searchTerm, setSearchTermState] = useState('');

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryFilter =
        filter === 'all' ? undefined : filter === 'completed' ? { completed: true } : { completed: false };

      const data = await taskApi.list(queryFilter);

      // Apply search filter locally
      let filtered = data;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = data.filter(
          (task) =>
            task.title.toLowerCase().includes(term) ||
            (task.description && task.description.toLowerCase().includes(term))
        );
      }

      setTasks(filtered);
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : 'Failed to fetch tasks';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  // Refresh tasks
  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // Create task
  const createTask = async (data: TaskFormData) => {
    try {
      setError(null);
      const newTask = await taskApi.create(data);

      // Optimistic update
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : 'Failed to create task';
      setError(message);
      throw err;
    }
  };

  // Update task
  const updateTask = async (id: string, data: Partial<TaskFormData>) => {
    try {
      setError(null);
      const updated = await taskApi.update(id, data);

      // Optimistic update
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : 'Failed to update task';
      setError(message);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      setError(null);

      // Optimistic update
      setTasks((prev) => prev.filter((task) => task.id !== id));

      await taskApi.delete(id);
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : 'Failed to delete task';
      setError(message);
      throw err;
    }
  };

  // Toggle completion
  const toggleComplete = async (id: string) => {
    try {
      setError(null);

      // Optimistic update
      const task = tasks.find((t) => t.id === id);
      if (!task) throw new Error('Task not found');

      const newCompleted = !task.completed;
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)));

      await taskApi.toggleComplete(id, newCompleted);
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : 'Failed to update task';
      setError(message);

      // Rollback
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id);
        return task
          ? prev.map((t) => (t.id === id ? { ...t, completed: !task.completed } : t))
          : prev;
      });

      throw err;
    }
  };

  // Set filter
  const setFilter = useCallback((newFilter: TaskFilter) => {
    setFilterState(newFilter);
  }, []);

  // Set search term
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch tasks on mount and when filter/search changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    filter,
    searchTerm,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setFilter,
    setSearchTerm,
    refreshTasks,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
