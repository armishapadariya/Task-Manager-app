// Base API URL for JSONPlaceholder
const API_URL = 'https://jsonplaceholder.typicode.com';

// Generic fetch function with error handling
async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API endpoints for different resources
export const api = {
  // User endpoints
  users: {
    getAll: () => fetchData<User[]>('/users'),
    getById: (id: number) => fetchData<User>(`/users/${id}`),
    getUserPosts: (userId: number) => fetchData<Post[]>(`/users/${userId}/posts`),
    getUserTodos: (userId: number) => fetchData<Todo[]>(`/users/${userId}/todos`),
  },
  
  // Post endpoints
  posts: {
    getAll: () => fetchData<Post[]>('/posts'),
    getById: (id: number) => fetchData<Post>(`/posts/${id}`),
    getComments: (postId: number) => fetchData<Comment[]>(`/posts/${postId}/comments`),
    create: (data: Omit<Post, 'id'>) => 
      fetchData<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Post>) => 
      fetchData<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => 
      fetchData<{}>(`/posts/${id}`, { method: 'DELETE' }),
  },
  
  // Todo endpoints
  todos: {
    getAll: () => fetchData<Todo[]>('/todos'),
    getById: (id: number) => fetchData<Todo>(`/todos/${id}`),
    create: (data: Omit<Todo, 'id'>) => 
      fetchData<Todo>('/todos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Todo>) => 
      fetchData<Todo>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleComplete: (id: number, completed: boolean) => 
      fetchData<Todo>(`/todos/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify({ completed }) 
      }),
    delete: (id: number) => 
      fetchData<{}>(`/todos/${id}`, { method: 'DELETE' }),
  },
  
  // Comment endpoints
  comments: {
    create: (postId: number, data: Omit<Comment, 'id' | 'postId'>) => 
      fetchData<Comment>('/comments', { 
        method: 'POST', 
        body: JSON.stringify({ ...data, postId }) 
      }),
    delete: (id: number) => 
      fetchData<{}>(`/comments/${id}`, { method: 'DELETE' }),
  },
};

// Types for the API data
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}