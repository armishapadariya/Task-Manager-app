import React, { useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Dashboard } from '../components/dashboard/Dashboard';

export function DashboardPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Dashboard | Blog Management';
  }, []);
  
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}