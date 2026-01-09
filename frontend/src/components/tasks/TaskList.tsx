"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskFilter } from "@/types";
import { TaskCard } from "./TaskCard";
import { TaskCardSkeleton, TaskListSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onSearch: (query: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

const filterTabs = [
  { value: "all" as const, label: "All" },
  { value: "active" as const, label: "Active" },
  { value: "completed" as const, label: "Completed" },
] as const;

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onSearch,
  onToggle,
  onEdit,
  onDelete,
  onCreateNew,
  isLoading = false,
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  }, [tasks, filter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Filter tabs skeleton */}
        <div className="flex gap-1">
          {filterTabs.map((_, i) => (
            <div key={i} className="h-9 w-16 skeleton rounded-lg" />
          ))}
        </div>
        {/* Search skeleton */}
        <div className="h-11 skeleton rounded-lg" />
        {/* Task list skeleton */}
        <TaskListSkeleton count={5} />
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-h4 text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-body-sm text-gray-500 max-w-sm mx-auto mb-6">
          Create your first task to start being productive and organized.
        </p>
        <Button onClick={onCreateNew}>Create your first task</Button>
      </div>
    );
  }

  // Filtered empty state
  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-h4 text-gray-900 mb-2">
          No {filter === "completed" ? "completed" : "active"} tasks
        </h3>
        <p className="text-body-sm text-gray-500 max-w-sm mx-auto mb-6">
          {filter === "all"
            ? "No tasks found."
            : filter === "completed"
            ? "You haven't completed any tasks yet."
            : "All your tasks are complete!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all duration-150",
              filter === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">
              (
              {tab.value === "all"
                ? tasks.length
                : tab.value === "active"
                ? tasks.filter((t) => !t.completed).length
                : tasks.filter((t) => t.completed).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          leftElement={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
