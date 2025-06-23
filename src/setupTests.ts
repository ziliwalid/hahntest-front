import '@testing-library/jest-dom';

// Supprimer les warnings React Router
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' && 
    (message.includes('React Router Future Flag Warning') ||
     message.includes('v7_startTransition') ||
     message.includes('v7_relativeSplatPath'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' && 
    (message.includes('Warning: An update to') ||
     message.includes('not wrapped in act'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Mock global pour éviter les erreurs de navigation
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});