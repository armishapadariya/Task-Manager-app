import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { Post } from '../../services/api';
import { Card } from '../ui/Card';

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <Card>
      <Card.Header className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Recent Posts</h2>
        <Link 
          to="/posts"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </Card.Header>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
            >
              <Link to={`/posts/${post.id}`} className="block">
                <h3 className="text-base font-medium text-gray-800 dark:text-white line-clamp-1">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.body}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <FileText size={32} className="mx-auto mb-2" />
            <p>No posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </Card>
  );
}