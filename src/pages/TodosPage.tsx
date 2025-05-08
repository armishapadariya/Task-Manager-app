import React, { useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { TodosList } from '../components/todos/TodosList';

export function TodosPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Todos | Blog Management';
  }, []);
  
  return (
    <MainLayout>
      <TodosList />
    </MainLayout>
  );
}