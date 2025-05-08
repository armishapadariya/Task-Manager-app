import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PostDetail } from '../components/posts/PostDetail';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  // Update document title
  useEffect(() => {
    document.title = 'Post Details | Blog Management';
  }, []);
  
  return (
    <MainLayout>
      <PostDetail />
    </MainLayout>
  );
}