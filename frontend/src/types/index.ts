export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface TaskFilters {
  completed?: boolean;
  search?: string;
  sort?: "due_date" | "created_at" | "title";
}

export type TaskFilter = "all" | "active" | "completed";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}
