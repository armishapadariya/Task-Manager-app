import React, { useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { PostsList } from '../components/posts/PostsList';

export function PostsPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Posts | Blog Management';
  }, []);
  
  return (
    <MainLayout>
      <PostsList />
    </MainLayout>
  );
}