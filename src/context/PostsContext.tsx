import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Post } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface PostsContextType {
  posts: Post[];
  userPosts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchUserPosts: () => Promise<void>;
  createPost: (title: string, body: string) => Promise<Post | null>;
  updatePost: (id: number, title: string, body: string) => Promise<Post | null>;
  deletePost: (id: number) => Promise<boolean>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}

interface PostsProviderProps {
  children: ReactNode;
}

export function PostsProvider({ children }: PostsProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useAuth();

  // Fetch all posts
  async function fetchPosts() {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.posts.getAll();
      setPosts(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Fetch posts for the current user
  async function fetchUserPosts() {
    if (!currentUser || loading) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.users.getUserPosts(currentUser.id);
      setUserPosts(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch your posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Create a new post
  async function createPost(title: string, body: string): Promise<Post | null> {
    if (!currentUser) {
      toast.error('You must be logged in to create a post');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const newPost = await api.posts.create({
        userId: currentUser.id,
        title,
        body
      });

      const simulatedPost = {
        ...newPost,
        id: Math.floor(Math.random() * 1000) + 100 // Random ID for simulation
      };

      // Update local state
      setUserPosts(prev => [simulatedPost, ...prev]);
      setPosts(prev => [simulatedPost, ...prev]);

      toast.success('Post created successfully!');
      return simulatedPost;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create post';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Update an existing post
  async function updatePost(id: number, title: string, body: string): Promise<Post | null> {
    if (!currentUser) {
      toast.error('You must be logged in to update a post');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedPost = await api.posts.update(id, { title, body });

      // Update local state
      setUserPosts(prev =>
        prev.map(post => post.id === id ? { ...post, title, body } : post)
      );
      setPosts(prev =>
        prev.map(post => post.id === id ? { ...post, title, body } : post)
      );

      toast.success('Post updated successfully!');
      return updatedPost;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update post';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Delete a post
  async function deletePost(id: number): Promise<boolean> {
    if (!currentUser) {
      toast.error('You must be logged in to delete a post');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      await api.posts.delete(id);

      // Update local state
      setUserPosts(prev => prev.filter(post => post.id !== id));
      setPosts(prev => prev.filter(post => post.id !== id));

      toast.success('Post deleted successfully!');
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete post';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    posts,
    userPosts,
    loading,
    error,
    fetchPosts,
    fetchUserPosts,
    createPost,
    updatePost,
    deletePost
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}