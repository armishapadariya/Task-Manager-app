import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Atom as At, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login, loading } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <Card.Header>
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Sign in to your account
        </h1>
      </Card.Header>
      
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            leftIcon={<At size={18} />}
            error={errors.email?.message}
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<KeyRound size={18} />}
            error={errors.password?.message}
            fullWidth
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={loading}
          >
            Sign in
          </Button>
        </form>
      </Card.Body>
      
      <Card.Footer className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          <strong>Demo Users:</strong> Try email "Sincere@april.biz" with any password
        </p>
      </Card.Footer>
    </Card>
  );
}