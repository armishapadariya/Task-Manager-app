import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Edit, Trash, User } from 'lucide-react';
import { api, Post, Comment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import { useComments } from '../../context/CommentsContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { CommentForm } from '../comments/CommentForm';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userPosts, deletePost } = usePosts();
  const { comments, fetchComments, loading: commentsLoading } = useComments();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const postId = parseInt(id || '0');
  const isUserPost = userPosts.some(p => p.id === postId);
  const postComments = comments[postId] || [];

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const data = await api.posts.getById(postId);
        setPost(data);
        
        // Fetch comments for this post
        fetchComments(postId);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to load post';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      loadPost();
    }
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const deleted = await deletePost(postId);
      if (deleted) {
        navigate('/posts');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Error Loading Post
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || 'Post not found'}
        </p>
        <Link to="/posts">
          <Button variant="primary">Back to Posts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        
        {isUserPost && (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Edit size={16} />}
              onClick={() => navigate(`/posts/${post.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <Card.Body>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{post.body}</p>
          </div>
        </Card.Body>
      </Card>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Comments ({postComments.length})
        </h2>
        
        {currentUser && (
          <CommentForm postId={postId} />
        )}
        
        <div className="mt-4 space-y-4">
          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          ) : postComments.length > 0 ? (
            postComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-2" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <Card className="overflow-visible">
      <Card.Body>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User size={16} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.name}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.email}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {comment.body}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}