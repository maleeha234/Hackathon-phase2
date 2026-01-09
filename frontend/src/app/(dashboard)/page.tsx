"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";

export default function DashboardPage() {
  // Placeholder dashboard - redirect to tasks or show overview
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-h2 text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-body text-gray-600">
          Here&apos;s an overview of your tasks and productivity.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="outlined">
          <CardBody>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-body-sm text-gray-500 mt-1">Total Tasks</p>
            </div>
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardBody>
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600">0</p>
              <p className="text-body-sm text-gray-500 mt-1">Completed</p>
            </div>
          </CardBody>
        </Card>
        <Card variant="outlined">
          <CardBody>
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600">0</p>
              <p className="text-body-sm text-gray-500 mt-1">Active</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardBody>
          <h2 className="text-h4 text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tasks">
              <Button variant="outline" fullWidth leftIcon={<Plus className="w-4 h-4" />}>
                View All Tasks
              </Button>
            </Link>
            <Button variant="secondary" fullWidth leftIcon={<Plus className="w-4 h-4" />}>
              Create New Task
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
