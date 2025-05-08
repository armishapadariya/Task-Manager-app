import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { File, ArrowLeft } from 'lucide-react';
import { api, Post } from '../../services/api';
import { usePosts } from '../../context/PostsContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

interface PostFormData {
  title: string;
  body: string;
}

export function PostForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { createPost, updatePost } = usePosts();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<PostFormData>();

  // Load post data if editing
  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      
      try {
        setLoading(true);
        const postId = parseInt(id);
        const data = await api.posts.getById(postId);
        setPost(data);
        reset({ title: data.title, body: data.body });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to load post';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (isEditing) {
      loadPost();
    }
  }, [id, isEditing, reset]);

  // Handle form submission
  const onSubmit = async (data: PostFormData) => {
    try {
      setSubmitting(true);
      
      if (isEditing && id) {
        const postId = parseInt(id);
        await updatePost(postId, data.title, data.body);
        navigate(`/posts/${postId}`);
      } else {
        const newPost = await createPost(data.title, data.body);
        if (newPost) {
          navigate(`/posts/${newPost.id}`);
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred while saving';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isEditing && error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Error Loading Post
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>
        <Button 
          variant="primary"
          onClick={() => navigate('/posts')}
        >
          Back to Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Post Title"
              placeholder="Enter a title for your post"
              error={errors.title?.message}
              fullWidth
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters'
                }
              })}
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                className={`
                  px-4 py-2 bg-white dark:bg-gray-800 border rounded-md w-full h-64
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.body ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
                `}
                placeholder="Write your post content here..."
                {...register('body', {
                  required: 'Content is required',
                  minLength: {
                    value: 10,
                    message: 'Content must be at least 10 characters'
                  }
                })}
              ></textarea>
              {errors.body && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.body.message}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<File size={16} />}
                isLoading={submitting}
              >
                {isEditing ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}