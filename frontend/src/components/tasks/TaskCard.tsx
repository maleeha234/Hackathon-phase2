"use client";

import * as React from "react";
import { Check, Clock, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isOptimistic?: boolean;
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  isOptimistic = false,
}: TaskCardProps) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        "group relative p-4 border border-gray-200 rounded-lg bg-white transition-all duration-200",
        "hover:shadow-md hover:border-primary-200",
        task.completed && "opacity-60",
        isOptimistic && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150",
            task.completed
              ? "bg-success-500 border-success-500 text-white"
              : "border-gray-300 hover:border-primary-500",
            isOptimistic && "animate-pulse"
          )}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          disabled={isOptimistic}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium text-gray-900 transition-all",
              task.completed && "line-through text-gray-500"
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={cn(
                "mt-1 text-sm text-gray-500 truncate-2-lines",
                task.completed && "line-through"
              )}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {/* Due date */}
            {task.dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  isOverdue
                    ? "bg-danger-50 text-danger-600"
                    : task.completed
                    ? "bg-gray-100 text-gray-500"
                    : "bg-warning-50 text-warning-600"
                )}
              >
                <Clock className="w-3 h-3" />
                {isOverdue ? "Overdue" : formatDate(task.dueDate)}
              </span>
            )}

            {/* Created date */}
            <span className="text-xs text-gray-400">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
            aria-label={`Edit task: ${task.title}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-colors"
            aria-label={`Delete task: ${task.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
