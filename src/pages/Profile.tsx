import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import { TaskStats } from '../types';
import { User, Calendar, CheckCircle, Clock, AlertTriangle, ListTodo, Loader } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getStatistics();
      setStats(data);
    } catch (err: any) {
      console.error('Profile stats fetch error:', err);
      setError('Failed to load profile statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account and view your task statistics</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Task Statistics</h3>
            
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-xl inline-flex items-center justify-center mb-3">
                    <ListTodo className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>

                <div className="text-center">
                  <div className="p-3 bg-emerald-100 rounded-xl inline-flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>

                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-xl inline-flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>

                <div className="text-center">
                  <div className="p-3 bg-red-100 rounded-xl inline-flex items-center justify-center mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.overdue}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">No statistics available</div>
              </div>
            )}

            {stats && stats.total > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-900">
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates about your tasks</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Task Reminders</h4>
              <p className="text-sm text-gray-600">Get reminded about upcoming due dates</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;