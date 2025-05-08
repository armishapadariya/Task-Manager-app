import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api, Comment } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CommentsContextType {
  comments: Record<number, Comment[]>; // postId -> comments
  loading: boolean;
  error: string | null;
  fetchComments: (postId: number) => Promise<Comment[]>;
  addComment: (postId: number, name: string, email: string, body: string) => Promise<Comment | null>;
  deleteComment: (commentId: number, postId: number) => Promise<boolean>;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}

interface CommentsProviderProps {
  children: ReactNode;
}

export function CommentsProvider({ children }: CommentsProviderProps) {
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useAuth();

  // Fetch comments for a specific post
  async function fetchComments(postId: number): Promise<Comment[]> {
    try {
      setLoading(true);
      setError(null);
      
      const postComments = await api.posts.getComments(postId);
      
      // Update comments state
      setComments(prev => ({
        ...prev,
        [postId]: postComments
      }));
      
      return postComments;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch comments';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Add a comment to a post
  async function addComment(
    postId: number, 
    name: string, 
    email: string, 
    body: string
  ): Promise<Comment | null> {
    try {
      setLoading(true);
      setError(null);
      
      const newComment = await api.comments.create(postId, { name, email, body });
      
      // JSONPlaceholder doesn't actually save new comments, so we'll simulate it
      const simulatedComment = {
        ...newComment,
        id: Math.floor(Math.random() * 1000) + 500, // Random ID for simulation
        postId
      };
      
      // Update comments state
      setComments(prev => ({
        ...prev,
        [postId]: [simulatedComment, ...(prev[postId] || [])]
      }));
      
      toast.success('Comment added successfully!');
      return simulatedComment;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to add comment';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Delete a comment
  async function deleteComment(commentId: number, postId: number): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);
      
      await api.comments.delete(commentId);
      
      // Update comments state
      setComments(prev => {
        const updated = { ...prev };
        if (updated[postId]) {
          updated[postId] = updated[postId].filter(comment => comment.id !== commentId);
        }
        return updated;
      });
      
      toast.success('Comment deleted successfully!');
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete comment';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
}