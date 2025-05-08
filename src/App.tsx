import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import { TodosProvider } from './context/TodosContext';
import { CommentsProvider } from './context/CommentsContext';

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <TodosProvider>
          <CommentsProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#333',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10B981',
                    color: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#EF4444',
                    color: '#fff',
                  },
                },
              }}
            />
          </CommentsProvider>
        </TodosProvider>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;