import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, CheckSquare, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import { useTodos } from '../../context/TodosContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { DashboardStats } from './DashboardStats';
import { RecentPosts } from './RecentPosts';
import { TodosList } from '../todos/TodosList';

export function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userPosts, loading: postsLoading, fetchUserPosts } = usePosts();
  const { 
    todos, 
    loading: todosLoading, 
    fetchTodos,
    filteredTodos
  } = useTodos();

  useEffect(() => {
    fetchUserPosts();
    fetchTodos();
  }, []);

  // Calculate statistics
  const totalPosts = userPosts.length;
  const pendingTodos = filteredTodos('pending').length;
  const completedTodos = filteredTodos('completed').length;

  // Show loading state when necessary
  if (postsLoading || todosLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome, {currentUser?.name}!
        </h1>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <Button 
            variant="primary"
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/posts/new')}
          >
            New Post
          </Button>
          <Button 
            variant="outline"
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/todos')}
          >
            New Todo
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <DashboardStats 
        totalPosts={totalPosts}
        pendingTodos={pendingTodos} 
        completedTodos={completedTodos}
      />
      
      {/* Recent Posts & Todos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <RecentPosts posts={userPosts.slice(0, 5)} />
        </div>
        <div>
          <Card>
            <Card.Header className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Pending Todos</h2>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/todos')}
              >
                View All
              </Button>
            </Card.Header>
            <TodosList 
              todos={filteredTodos('pending').slice(0, 5)} 
              showActions={false}
            />
            {filteredTodos('pending').length === 0 && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <CheckSquare size={32} className="mx-auto mb-2" />
                <p>All caught up! No pending todos.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}