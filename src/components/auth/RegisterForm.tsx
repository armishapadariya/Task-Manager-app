import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { User, Atom as At, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const { register: registerUser, loading } = useAuth();
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data.name, data.email, data.password);
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <Card.Header>
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create an account
        </h1>
      </Card.Header>
      
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User size={18} />}
            error={errors.name?.message}
            fullWidth
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
          />
          
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
          
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<KeyRound size={18} />}
            error={errors.confirmPassword?.message}
            fullWidth
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>
      </Card.Body>
      
      <Card.Footer className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </Card.Footer>
    </Card>
  );
}