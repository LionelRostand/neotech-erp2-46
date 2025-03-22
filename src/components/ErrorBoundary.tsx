
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// This component is used as a class component boundary
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

// This component can be used as a route errorElement
export function RouteErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorPage 
        title={`${error.status} ${error.statusText}`}
        message={error.data?.message || 'Something went wrong'} 
      />
    );
  }

  if (error instanceof Error) {
    return <ErrorPage error={error} />;
  }

  return <ErrorPage message="An unknown error occurred" />;
}

// Main error display component used by both boundary types
function ErrorPage({ 
  error, 
  title = 'Something went wrong',
  message
}: { 
  error?: Error;
  title?: string;
  message?: string;
}) {
  const navigate = useNavigate();

  const errorMessage = message || error?.message || 'An unexpected error occurred';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="w-full"
          >
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/', { replace: true })} 
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="secondary" 
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
        
        {error && process.env.NODE_ENV !== 'production' && (
          <div className="mt-6 p-4 bg-gray-100 rounded text-left">
            <p className="text-sm font-semibold mb-2">Error Details (Development Only):</p>
            <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap">
              {error.stack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the class component as default
export default ErrorBoundaryClass;
