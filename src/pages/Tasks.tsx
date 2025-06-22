import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { Task, TaskStatus, TaskPriority, CreateTaskData, UpdateTaskData } from '../types';
import TaskModal from '../components/TaskModal';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  AlertTriangle,
  Calendar,
  Loader,
  ChevronDown
} from 'lucide-react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error('Tasks fetch error:', err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      const newTask = await tasksAPI.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Create task error:', err);
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, taskData: UpdateTaskData) => {
    try {
      const updatedTask = await tasksAPI.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Update task error:', err);
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err: any) {
      console.error('Delete task error:', err);
      setError('Failed to delete task');
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const updatedTask = await tasksAPI.completeTask(id);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (err: any) {
      console.error('Complete task error:', err);
      setError('Failed to complete task');
    }
  };

  const handleSetInProgress = async (id: string) => {
    try {
      const updatedTask = await tasksAPI.setInProgress(id);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (err: any) {
      console.error('Set in progress error:', err);
      setError('Failed to update task status');
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    const statusStyles = {
      PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusStyles[status];
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      LOW: 'text-emerald-600 bg-emerald-50',
      MEDIUM: 'text-amber-600 bg-amber-50',
      HIGH: 'text-orange-600 bg-orange-50',
      URGENT: 'text-red-600 bg-red-50',
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'URGENT':
        return <AlertTriangle className="w-3 h-3" />;
      case 'HIGH':
        return <div className="w-3 h-3 rounded-full bg-orange-500" />;
      case 'MEDIUM':
        return <div className="w-3 h-3 rounded-full bg-amber-500" />;
      case 'LOW':
        return <div className="w-3 h-3 rounded-full bg-emerald-500" />;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date().toDateString() !== new Date(dueDate).toDateString();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">Manage and track your tasks efficiently</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'ALL')}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'ALL')}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
              >
                <option value="ALL">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
                      {task.dueDate && isOverdue(task.dueDate) && task.status !== 'COMPLETED' && (
                        <div className="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded-full">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Overdue</span>
                        </div>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1">{task.priority}</span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === task.id ? null : task.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {dropdownOpen === task.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          {task.status !== 'COMPLETED' && (
                            <button
                              onClick={() => {
                                handleCompleteTask(task.id);
                                setDropdownOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 mr-3 text-emerald-500" />
                              Mark Complete
                            </button>
                          )}
                          {task.status === 'PENDING' && (
                            <button
                              onClick={() => {
                                handleSetInProgress(task.id);
                                setDropdownOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Clock className="w-4 h-4 mr-3 text-blue-500" />
                              Set In Progress
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsModalOpen(true);
                              setDropdownOpen(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-3 text-gray-500" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteTask(task.id);
                              setDropdownOpen(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {!searchTerm && statusFilter === 'ALL' && priorityFilter === 'ALL' && (
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? 
          (data) => handleUpdateTask(editingTask.id, data) : 
          handleCreateTask
        }
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;