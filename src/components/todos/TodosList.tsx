import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, Trash, Edit, Plus, Search } from 'lucide-react';
import { useTodos } from '../../context/TodosContext';
import { Todo } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';
import { Badge } from '../ui/Badge';
import { TodoForm } from './TodoForm';

interface TodosListProps {
  todos?: Todo[];
  showActions?: boolean;
}

export function TodosList({ todos, showActions = true }: TodosListProps) {
  const { 
    todos: allTodos, 
    loading, 
    fetchTodos, 
    toggleTodoStatus, 
    deleteTodo 
  } = useTodos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  
  const displayTodos = todos || allTodos;

  // Fetch todos on component mount
  useEffect(() => {
    if (!todos) {
      fetchTodos();
    }
  }, []);

  // Filter and search todos
  const filteredTodos = displayTodos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed);
    
    return matchesSearch && matchesFilter;
  });

  // Handle todo status toggle
  const handleToggleStatus = async (id: number, completed: boolean) => {
    await toggleTodoStatus(id, !completed);
  };

  // Handle todo deletion
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(id);
    }
  };

  // Handle adding new todo
  const handleAddTodo = () => {
    setIsAddingTodo(true);
    setEditingTodoId(null);
  };

  // Handle editing todo
  const handleEditTodo = (id: number) => {
    setEditingTodoId(id);
    setIsAddingTodo(false);
  };

  // Close form
  const handleCloseForm = () => {
    setIsAddingTodo(false);
    setEditingTodoId(null);
  };

  if (!showActions && (!displayTodos || displayTodos.length === 0)) {
    return (
      <Card.Body className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No todos found</p>
      </Card.Body>
    );
  }

  if (loading && !todos) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={!showActions ? '' : 'space-y-6'}>
      {showActions && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Todo List
            </h1>
            <Button 
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleAddTodo}
              className="mt-4 md:mt-0"
            >
              Add Todo
            </Button>
          </div>

          <Card>
            <Card.Header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'pending' 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'completed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Completed
                </button>
              </div>
              
              <div className="w-full md:w-64">
                <Input
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={18} />}
                  fullWidth
                />
              </div>
            </Card.Header>
          
            {isAddingTodo && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <TodoForm onClose={handleCloseForm} />
              </div>
            )}
          </Card>
        </>
      )}

      <div className={showActions ? "space-y-4" : ""}>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo.id}>
              {editingTodoId === todo.id ? (
                <Card className="mb-4">
                  <div className="px-6 py-4">
                    <TodoForm todo={todo} onClose={handleCloseForm} />
                  </div>
                </Card>
              ) : (
                <Card className="mb-4 transform transition-all duration-200 hover:shadow-md">
                  <Card.Body className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleToggleStatus(todo.id, todo.completed)}
                        className={`mr-3 text-lg ${todo.completed ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}
                      >
                        {todo.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                      </button>
                      <div>
                        <p className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                          {todo.title}
                        </p>
                        <div className="mt-1">
                          <Badge
                            variant={todo.completed ? 'success' : 'warning'}
                            size="sm"
                            rounded
                          >
                            {todo.completed ? 'Completed' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {showActions && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit size={14} />}
                          onClick={() => handleEditTodo(todo.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash size={14} />}
                          onClick={() => handleDelete(todo.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
            </div>
          ))
        ) : (
          <Card>
            <Card.Body className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchTerm ? (
                <p>No todos found matching "{searchTerm}"</p>
              ) : filter !== 'all' ? (
                <p>No {filter} todos found</p>
              ) : (
                <p>No todos available</p>
              )}
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}