"use client";

import * as React from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { Task, TaskFormData } from "@/types";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task | null;
  isLoading?: boolean;
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading = false,
}: TaskFormProps) {
  const isEditMode = !!task;
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [error, setError] = React.useState("");

  // Reset form when opening/closing
  React.useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate || "");
    } else if (isOpen && !task) {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
    setError("");
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (title.length > 100) {
      setError("Title must be 100 characters or less");
      return;
    }
    if (description.length > 1000) {
      setError("Description must be 1000 characters or less");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
    });
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button type="submit" form="task-form" isLoading={isLoading}>
        {isEditMode ? "Save Changes" : "Create Task"}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Task" : "Create Task"}
      description={
        isEditMode
          ? "Update your task details below"
          : "Add a new task to your list"
      }
      size="md"
      footer={footer}
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g., Review Q4 budget proposal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
          error={error}
          autoFocus
        />

        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            className={cn(
              "w-full px-3 py-2 text-sm border rounded-md transition-colors duration-150",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "resize-none"
            )}
          />
          {description.length > 900 && (
            <p className="text-xs text-gray-500 text-right">
              {description.length}/1000 characters
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="due-date"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <div className="relative">
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
              className={cn(
                "w-full h-11 pl-10 pr-3 text-sm border rounded-md transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              )}
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear due date"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
