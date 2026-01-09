"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { Task, TaskFormData } from "@/types";
import { useTasks } from "@/contexts/TaskContext";
import { ApiError } from "@/lib/api";

export default function TasksPage() {
  const {
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
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isFormLoading, setIsFormLoading] = React.useState(false);
  const { toasts, removeToast, toast } = useToast();

  // Handle toggle task completion
  const handleToggle = async (id: string) => {
    try {
      await toggleComplete(id);

      const task = tasks.find((t) => t.id === id);
      if (task) {
        toast.success(
          task.completed ? "Task marked as incomplete" : "Task completed!",
          task.completed ? "You can continue working on it." : "Great job!"
        );
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : "Failed to update task";
      toast.error("Error", message);
    }
  };

  // Handle edit task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Handle delete task
  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted", "The task has been removed.");
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : "Failed to delete task";
      toast.error("Error", message);
    }
  };

  // Handle form submit
  const handleFormSubmit = async (data: TaskFormData) => {
    setIsFormLoading(true);

    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, data);
        toast.success("Task updated", "Your changes have been saved.");
      } else {
        // Create new task
        await createTask(data);
        toast.success("Task created", "Your new task has been added.");
      }

      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.detail : "Failed to save task";
      toast.error("Error", message);
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle create new task
  const handleCreateNew = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Handle filter change
  const handleFilterChange = (newFilter: "all" | "active" | "completed") => {
    setFilter(newFilter);
  };

  // Dismiss error toast
  React.useEffect(() => {
    if (error) {
      toast.error("Error", error);
      clearError();
    }
  }, [error, toast, clearError]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-gray-900">Tasks</h1>
          <p className="text-body text-gray-600 mt-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={handleCreateNew} leftIcon={<Plus className="w-4 h-4" />}>
          New Task
        </Button>
      </div>

      {/* Task list */}
      <TaskList
        tasks={tasks}
        filter={filter}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
        loading={loading}
      />

      {/* Task form modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        task={editingTask}
        isLoading={isFormLoading}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
