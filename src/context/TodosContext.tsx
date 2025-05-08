import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Todo } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface TodosContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (title: string) => Promise<Todo | null>;
  toggleTodoStatus: (id: number, completed: boolean) => Promise<Todo | null>;
  updateTodo: (id: number, title: string) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<boolean>;
  filteredTodos: (status: 'all' | 'completed' | 'pending') => Todo[];
}

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export function useTodos() {
  const context = useContext(TodosContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
}

interface TodosProviderProps {
  children: ReactNode;
}

export function TodosProvider({ children }: TodosProviderProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useAuth();

  // Fetch todos for the current user
  async function fetchTodos() {
    if (!currentUser || loading) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.users.getUserTodos(currentUser.id);
      setTodos(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch todos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Create a new todo
  async function createTodo(title: string): Promise<Todo | null> {
    if (!currentUser) {
      toast.error('You must be logged in to create a todo');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const newTodo = await api.todos.create({
        userId: currentUser.id,
        title,
        completed: false
      });

      const simulatedTodo = {
        ...newTodo,
        id: Math.floor(Math.random() * 1000) + 200 // Random ID for simulation
      };

      // Update local state
      setTodos(prev => [simulatedTodo, ...prev]);

      toast.success('Todo created successfully!');
      return simulatedTodo;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create todo';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Toggle todo completion status
  async function toggleTodoStatus(id: number, completed: boolean): Promise<Todo | null> {
    if (!currentUser) {
      toast.error('You must be logged in to update a todo');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      await api.todos.toggleComplete(id, completed);

      // Update local state
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      );
      setTodos(updatedTodos);

      const statusText = completed ? 'completed' : 'marked as pending';
      toast.success(`Todo ${statusText} successfully!`);

      return updatedTodos.find(todo => todo.id === id) || null;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update todo';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Update a todo title
  async function updateTodo(id: number, title: string): Promise<Todo | null> {
    if (!currentUser) {
      toast.error('You must be logged in to update a todo');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      await api.todos.update(id, { title });

      // Update local state
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, title } : todo
      );
      setTodos(updatedTodos);

      toast.success('Todo updated successfully!');
      return updatedTodos.find(todo => todo.id === id) || null;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update todo';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Delete a todo
  async function deleteTodo(id: number): Promise<boolean> {
    if (!currentUser) {
      toast.error('You must be logged in to delete a todo');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await api.todos.delete(id);

      // Update local state
      setTodos(prev => prev.filter(todo => todo.id !== id));

      toast.success('Todo deleted successfully!');
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete todo';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Filter todos based on status
  function filteredTodos(status: 'all' | 'completed' | 'pending'): Todo[] {
    switch (status) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      case 'all':
      default:
        return todos;
    }
  }

  const value = {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    toggleTodoStatus,
    updateTodo,
    deleteTodo,
    filteredTodos
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
}