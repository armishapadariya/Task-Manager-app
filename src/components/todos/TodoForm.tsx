import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckSquare, X } from 'lucide-react';
import { useTodos } from '../../context/TodosContext';
import { Todo } from '../../services/api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TodoFormData {
  title: string;
}

interface TodoFormProps {
  todo?: Todo;
  onClose: () => void;
}

export function TodoForm({ todo, onClose }: TodoFormProps) {
  const { createTodo, updateTodo, loading } = useTodos();
  const isEditing = !!todo;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<TodoFormData>({
    defaultValues: {
      title: todo?.title || ''
    }
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      if (isEditing && todo) {
        await updateTodo(todo.id, data.title);
      } else {
        await createTodo(data.title);
      }
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          {isEditing ? 'Edit Todo' : 'Add New Todo'}
        </h3>
        
        <Input
          placeholder="What needs to be done?"
          fullWidth
          error={errors.title?.message}
          {...register('title', {
            required: 'Todo title is required',
            minLength: {
              value: 3,
              message: 'Todo must be at least 3 characters'
            }
          })}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<X size={16} />}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<CheckSquare size={16} />}
            isLoading={loading}
          >
            {isEditing ? 'Update' : 'Add'} Todo
          </Button>
        </div>
      </div>
    </form>
  );
}