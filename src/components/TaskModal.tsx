import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { Task, CreateTaskData, UpdateTaskData, TaskPriority, TaskStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  task?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      // Convert ISO datetime to date input format (YYYY-MM-DD)
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIUM);
      setStatus(TaskStatus.PENDING);
      setDueDate('');
    }
    setError('');
  }, [task, isOpen]);

  const formatDateTimeForBackend = (dateString: string): string | null => {
    console.log('🔧 formatDateTimeForBackend input:', dateString);

    if (!dateString) {
      console.log('🔧 No date string provided, returning null');
      return null;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      console.error('🔧 Invalid date format:', dateString);
      throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
    }

    try {
      // Parse the date to ensure it's valid
      const dateObj = new Date(dateString + 'T00:00:00');
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date: ${dateString}`);
      }

      // Format as ISO string with time component
      const formattedDate = `${dateString}T00:00:00`;
      console.log('✅ Successfully formatted date:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('🔧 Error formatting date:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📝 Form submission started');
      console.log('📝 Raw form data:', {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate,
      });

      // Validate required fields
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      // Format the due date properly - this is the key fix
      let formattedDueDate: string | null = null;
      if (dueDate) {
        formattedDueDate = formatDateTimeForBackend(dueDate);
      }

      console.log('📝 Date processing:');
      console.log('  - Original dueDate input:', dueDate);
      console.log('  - Formatted dueDate for backend:', formattedDueDate);

      const data: CreateTaskData | UpdateTaskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: formattedDueDate, // This will be "2025-06-18T00:00:00" or null
      };

      // Only add status for updates (editing existing tasks)
      if (task) {
        (data as UpdateTaskData).status = status;
        console.log('📝 Adding status for update:', status);
      }

      console.log('📝 Final task data being submitted:');
      console.log(JSON.stringify(data, null, 2));

      // Final validation - ensure date format is correct
      if (data.dueDate) {
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        if (!dateTimeRegex.test(data.dueDate)) {
          throw new Error(`Invalid datetime format: ${data.dueDate}. Expected YYYY-MM-DDTHH:mm:ss`);
        }
      }

      console.log('🚀 SENDING TO BACKEND:');
      console.log('Raw data object:', data);
      console.log('JSON.stringify result:', JSON.stringify(data));
      console.log('dueDate type:', typeof data.dueDate);
      console.log('dueDate value:', data.dueDate);

      await onSubmit(data);
      console.log('✅ Task submission successful');
      onClose();
    } catch (err: any) {
      console.error('❌ Task submission error:', err);

      // Handle specific error messages
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.fieldErrors) {
        // Handle validation errors from backend
        const fieldErrors = err.response.data.fieldErrors;
        const errorMessages = Object.entries(fieldErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
        setError(errorMessages);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {task ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter task title"
                    maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter task description (optional)"
                    maxLength={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                    <option value={TaskPriority.URGENT}>Urgent</option>
                  </select>
                </div>

                {task && (
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as TaskStatus)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={TaskStatus.PENDING}>Pending</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                        <option value={TaskStatus.CANCELLED}>Cancelled</option>
                      </select>
                    </div>
                )}
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      console.log('📅 Date input changed:', e.target.value);
                      setDueDate(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
                {dueDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      <p>Due: {new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p className="text-blue-600 font-mono">
                        Backend format: {dueDate}T00:00:00
                      </p>
                    </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default TaskModal;