import React from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComments } from '../../context/CommentsContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CommentFormData {
  body: string;
}

interface CommentFormProps {
  postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
  const { currentUser } = useAuth();
  const { addComment, loading } = useComments();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<CommentFormData>();

  const onSubmit = async (data: CommentFormData) => {
    if (!currentUser) return;
    
    const success = await addComment(
      postId,
      currentUser.name,
      currentUser.email,
      data.body
    );
    
    if (success) {
      reset({ body: '' });
    }
  };

  if (!currentUser) return null;

  return (
    <Card className="mb-6">
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <textarea
              className={`
                px-4 py-2 bg-white dark:bg-gray-800 border rounded-md w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.body ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              `}
              placeholder="Write a comment..."
              rows={3}
              {...register('body', {
                required: 'Comment cannot be empty',
                minLength: {
                  value: 3,
                  message: 'Comment must be at least 3 characters'
                }
              })}
            ></textarea>
            {errors.body && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.body.message}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              rightIcon={<Send size={16} />}
              isLoading={loading}
            >
              Post Comment
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}