import React from 'react';
import { FileText, CheckSquare, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

interface DashboardStatsProps {
  totalPosts: number;
  pendingTodos: number;
  completedTodos: number;
}

export function DashboardStats({ 
  totalPosts, 
  pendingTodos, 
  completedTodos 
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts,
      icon: FileText,
      bgColor: 'bg-blue-500 dark:bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Pending Todos',
      value: pendingTodos,
      icon: Clock,
      bgColor: 'bg-amber-500 dark:bg-amber-600',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Completed Todos',
      value: completedTodos,
      icon: CheckSquare,
      bgColor: 'bg-green-500 dark:bg-green-600',
      textColor: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="group hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor} bg-opacity-10 dark:bg-opacity-20 group-hover:bg-opacity-20 dark:group-hover:bg-opacity-30 transition-all duration-300`}>
                <stat.icon 
                  size={24} 
                  className={stat.textColor}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}