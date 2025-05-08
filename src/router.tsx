import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PostsPage } from './pages/PostsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { PostFormPage } from './pages/PostFormPage';
import { TodosPage } from './pages/TodosPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/posts',
        element: <PostsPage />,
      },
      {
        path: '/posts/:id',
        element: <PostDetailPage />,
      },
      {
        path: '/posts/new',
        element: <PostFormPage />,
      },
      {
        path: '/posts/:id/edit',
        element: <PostFormPage />,
      },
      {
        path: '/todos',
        element: <TodosPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);