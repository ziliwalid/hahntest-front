import React, { useState, useEffect } from 'react';
import { healthAPI } from '../services/api';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking' | 'error';
  timestamp: Date;
  responseTime?: number;
  details?: any;
}

interface HealthCheckProps {
  interval?: number; // Check interval in milliseconds (default: 30 seconds)
  showDetails?: boolean;
  compact?: boolean;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ 
  interval = 30000, 
  showDetails = false,
  compact = false 
}) => {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    timestamp: new Date()
  });
  const [isVisible, setIsVisible] = useState(true);

  const checkHealth = async () => {
    const startTime = Date.now();
    
    try {
      setHealth(prev => ({ ...prev, status: 'checking' }));
      
      const response = await healthAPI.getHealth();
      const responseTime = Date.now() - startTime;
      
      setHealth({
        status: 'healthy',
        timestamp: new Date(),
        responseTime,
        details: response
      });
    } catch (error) {
      console.error('Health check failed:', error);
      const responseTime = Date.now() - startTime;
      
      setHealth({
        status: 'unhealthy',
        timestamp: new Date(),
        responseTime,
        details: error
      });
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Set up interval for periodic checks
    const healthInterval = setInterval(checkHealth, interval);

    return () => clearInterval(healthInterval);
  }, [interval]);

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'unhealthy':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'checking':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'error':
        return 'border-amber-200 bg-amber-50 text-amber-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (health.status) {
      case 'healthy':
        return 'API Online';
      case 'unhealthy':
        return 'API Offline';
      case 'checking':
        return 'Checking...';
      case 'error':
        return 'Check Failed';
      default:
        return 'Unknown';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        title="Show API Health Status"
      >
        <Wifi className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {health.responseTime && (
          <span className="text-xs text-gray-500">
            ({health.responseTime}ms)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`border rounded-lg shadow-lg p-4 max-w-sm transition-all duration-200 ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-semibold text-sm">{getStatusText()}</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Hide Health Status"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Check:</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(health.timestamp)}</span>
            </div>
          </div>

          {health.responseTime && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Response Time:</span>
              <span className={`font-medium ${
                health.responseTime < 200 ? 'text-emerald-600' :
                health.responseTime < 500 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {health.responseTime}ms
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Next Check:</span>
            <span>{Math.round(interval / 1000)}s</span>
          </div>
        </div>

        {showDetails && health.details && (
          <div className="mt-3 pt-3 border-t border-current border-opacity-20">
            <details className="text-xs">
              <summary className="cursor-pointer font-medium mb-1">
                API Details
              </summary>
              <pre className="bg-black bg-opacity-10 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(health.details, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <button
            onClick={checkHealth}
            disabled={health.status === 'checking'}
            className="w-full px-3 py-1 bg-white bg-opacity-50 hover:bg-opacity-75 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {health.status === 'checking' ? 'Checking...' : 'Check Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;