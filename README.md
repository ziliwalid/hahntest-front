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
- **Comprehensive Testing** - Unit tests with Jest and React Testing Library

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Testing**: Jest + React Testing Library
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

### 4. Run Tests
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── __tests__/             # Component tests
│   │   ├── HealthCheck.test.tsx
│   │   └── ProtectedRoute.test.tsx
│   ├── Layout.tsx             # Main application layout
│   ├── ProtectedRoute.tsx     # Route protection component
│   ├── TaskModal.tsx          # Task creation/editing modal
│   └── HealthCheck.tsx        # API health monitoring component
├── contexts/                  # React Context providers
│   └── AuthContext.tsx        # Authentication state management
├── pages/                     # Page components
│   ├── __tests__/             # Page tests
│   │   ├── Dashboard.test.tsx
│   │   └── Login.test.tsx
│   ├── Dashboard.tsx          # Main dashboard with statistics
│   ├── Tasks.tsx              # Task management page
│   ├── Login.tsx              # User login page
│   ├── Register.tsx           # User registration page
│   └── Profile.tsx            # User profile and statistics
├── services/                  # API service layer
│   └── api.ts                 # HTTP client and API endpoints
├── types/                     # TypeScript type definitions
│   └── index.ts               # Application types and interfaces
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── setupTests.ts              # Test configuration and setup
└── index.css                  # Global styles and Tailwind imports

Configuration Files:
├── jest.config.cjs            # Jest testing configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json          # App-specific TypeScript config
├── tsconfig.node.json         # Node-specific TypeScript config
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.ts             # Vite build configuration
├── eslint.config.js           # ESLint configuration
└── postcss.config.js          # PostCSS configuration
```

## 🧪 Testing

The application includes comprehensive testing with Jest and React Testing Library.

### Test Structure
- **Component Tests**: Located in `src/components/__tests__/`
- **Page Tests**: Located in `src/pages/__tests__/`
- **Test Setup**: Configured in `src/setupTests.ts`

### Test Features
- **Clean Output**: Warnings suppressed for cleaner test results
- **Mocked APIs**: All external API calls are mocked
- **React Router Support**: Tests include proper router context
- **Authentication Context**: Tests run with auth provider
- **TypeScript Support**: Full TypeScript integration in tests

### Available Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage
The test suite covers:
- ✅ Component rendering without errors
- ✅ Authentication flow components
- ✅ Protected route functionality
- ✅ API health monitoring
- ✅ Dashboard statistics display
- ✅ Login form functionality

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
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (recommended)
- **Testing**: Jest with React Testing Library

### Development Workflow
1. **Feature Development**: Create components with corresponding tests
2. **Testing**: Write unit tests for new functionality
3. **Type Safety**: Ensure proper TypeScript typing
4. **Code Quality**: Run ESLint and fix any issues
5. **Testing**: Verify all tests pass before committing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Contribution Guidelines
- Write tests for new features
- Maintain TypeScript type safety
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass

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

**Test Issues**
- Run `npm test` to check for test failures
- Ensure all mocks are properly configured
- Check for TypeScript compilation errors

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify backend API is running and accessible
3. Review the network tab for failed requests
4. Run tests to identify potential issues
5. Check this README for configuration requirements

## 🎉 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Icons provided by Lucide React
- HTTP client powered by Axios
- Testing with Jest and React Testing Library

---

**Happy Task Managing! 🎯**