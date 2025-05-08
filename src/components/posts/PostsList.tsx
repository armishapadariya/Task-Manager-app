import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { usePosts } from '../../context/PostsContext';
import { Post } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

export function PostsList() {
  const navigate = useNavigate();
  const { posts, userPosts, loading, fetchPosts, fetchUserPosts, deletePost } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  
  useEffect(() => {
    fetchPosts();
    fetchUserPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = (showMyPosts ? userPosts : posts).filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle post deletion
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  // Show loading state
  if (loading && posts.length === 0 && userPosts.length === 0) {
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
          Blog Posts
        </h1>
        <Button 
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => navigate('/posts/new')}
          className="mt-4 md:mt-0"
        >
          New Post
        </Button>
      </div>

      <Card>
        <Card.Header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMyPosts(false)}
              className={`px-3 py-1 rounded-md ${
                !showMyPosts 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setShowMyPosts(true)}
              className={`px-3 py-1 rounded-md ${
                showMyPosts 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              My Posts
            </button>
          </div>
          
          <div className="w-full md:w-64">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
              fullWidth
            />
          </div>
        </Card.Header>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostItem 
                key={post.id} 
                post={post} 
                onDelete={handleDelete}
                isUserPost={userPosts.some(p => p.id === post.id)}
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? (
                <p>No posts found matching "{searchTerm}"</p>
              ) : showMyPosts ? (
                <p>You haven't created any posts yet</p>
              ) : (
                <p>No posts available</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

interface PostItemProps {
  post: Post;
  onDelete: (id: number, e: React.MouseEvent) => void;
  isUserPost: boolean;
}

function PostItem({ post, onDelete, isUserPost }: PostItemProps) {
  return (
    <Link 
      to={`/posts/${post.id}`}
      className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            {post.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.body}
          </p>
        </div>
        
        {isUserPost && (
          <div className="flex space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit size={14} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/posts/${post.id}/edit`;
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash size={14} />}
              onClick={(e) => onDelete(post.id, e)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}