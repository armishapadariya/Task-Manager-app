import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PostForm } from '../components/posts/PostForm';

export function PostFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  
  // Update document title
  useEffect(() => {
    document.title = `${isEditing ? 'Edit' : 'Create'} Post | Blog Management`;
  }, [isEditing]);
  
  return (
    <MainLayout>
      <PostForm />
    </MainLayout>
  );
}