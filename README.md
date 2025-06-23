# Task Manager - Complete React Application

A modern, full-featured task management application built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive solution for managing tasks with user authentication, real-time API health monitoring, and a beautiful, responsive interface.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure login and registration system
- **Task Management** - Create, read, update, and delete tasks
- **Task Organization** - Filter and search tasks by status, priority, and keywords
- **Task Status Tracking** - Pending, In Progress, Completed, and Cancelled states
- **Priority Levels** - Low, Medium, High, and Urgent priority settings
- **Due Date Management** - Set and track task deadlines with overdue indicators
- **Statistics Dashboard** - Visual overview of task completion and progress

### User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Instant feedback on all user actions
- **API Health Monitoring** - Live status monitoring of backend connectivity
- **Protected Routes** - Secure navigation with authentication guards
- **Loading States** - Elegant loading indicators throughout the application

### Technical Features
- **TypeScript** - Full type safety and enhanced developer experience
- **React Router** - Client-side routing with protected routes
- **Axios Integration** - HTTP client with interceptors for token management
- **Context API** - Global state management for authentication
- **Error Handling** - Comprehensive error handling and user feedback
- **Token Refresh** - Automatic token refresh for seamless user experience

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Development**: ESLint, TypeScript ESLint

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   ├── ProtectedRoute.tsx  # Route protection component
│   ├── TaskModal.tsx   # Task creation/editing modal
│   └── HealthCheck.tsx # API health monitoring component
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard with statistics
│   ├── Tasks.tsx       # Task management page
│   ├── Login.tsx       # User login page
│   ├── Register.tsx    # User registration page
│   └── Profile.tsx     # User profile and statistics
├── services/           # API service layer
│   └── api.ts          # HTTP client and API endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types and interfaces
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🔧 Configuration

### Environment Variables
The application expects a backend API running on `http://localhost:8080`. To change this:

1. Update the `API_BASE_URL` in `src/services/api.ts`
2. Or create a `.env` file with:
```env
VITE_API_BASE_URL=http://your-api-url:port
```

### API Endpoints
The application expects the following backend endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

#### User Management
- `GET /api/users/me` - Get current user profile

#### Task Management
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task as complete
- `PATCH /api/tasks/:id/progress` - Set task in progress
- `GET /api/tasks/statistics` - Get task statistics

#### Health Check
- `GET /api/health` - API health status

## 🎨 UI Components

### Layout Components
- **Layout**: Main application shell with sidebar navigation
- **ProtectedRoute**: Authentication guard for protected pages
- **HealthCheck**: Real-time API status monitoring

### Page Components
- **Dashboard**: Overview with statistics and recent tasks
- **Tasks**: Complete task management interface
- **Login/Register**: Authentication forms
- **Profile**: User profile and task statistics

### Modal Components
- **TaskModal**: Task creation and editing interface

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with name, email, and password
2. **Login**: Authentication with email/username and password
3. **Token Management**: JWT tokens with automatic refresh
4. **Protected Routes**: Automatic redirection for unauthenticated users
5. **Logout**: Secure token cleanup and redirection

## 📊 Task Management Features

### Task Properties
- **Title**: Required task name (max 100 characters)
- **Description**: Optional detailed description (max 500 characters)
- **Status**: Pending, In Progress, Completed, Cancelled
- **Priority**: Low, Medium, High, Urgent
- **Due Date**: Optional deadline with overdue tracking
- **Timestamps**: Creation and update tracking

### Task Operations
- **Create**: Add new tasks with all properties
- **Update**: Edit existing tasks including status changes
- **Delete**: Remove tasks with confirmation
- **Quick Actions**: Mark complete, set in progress
- **Filtering**: By status, priority, and search terms
- **Sorting**: By creation date, due date, priority

## 🎯 Key Features Explained

### API Health Monitoring
- **Real-time Status**: Continuous monitoring of backend connectivity
- **Visual Indicators**: Color-coded status with response times
- **Multiple Views**: Compact sidebar view and detailed floating widget
- **Manual Refresh**: On-demand health checks

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Adaptive Layout**: Sidebar collapses on mobile with overlay
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Cross-Browser**: Compatible with modern browsers

### Error Handling
- **Network Errors**: Graceful handling of connectivity issues
- **Validation**: Client-side and server-side validation feedback
- **User Feedback**: Clear error messages and success notifications
- **Recovery**: Automatic retry mechanisms where appropriate

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Optimized Builds**: Vite's fast build system
- **Efficient Re-renders**: Proper React optimization patterns
- **Minimal Bundle Size**: Tree-shaking and dependency optimization

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**API Connection Issues**
- Ensure backend server is running on `http://localhost:8080`
- Check network connectivity and firewall settings
- Verify API endpoints match expected format

**Authentication Problems**
- Clear browser localStorage and cookies
- Check token expiration and refresh logic
- Verify backend authentication endpoints

**Build Issues**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all dependencies are properly installed

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify backend API is running and accessible
3. Review the network tab for failed requests
4. Check this README for configuration requirements

## 🎉 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Icons provided by Lucide React
- HTTP client powered by Axios

---

**Happy Task Managing! 🎯**