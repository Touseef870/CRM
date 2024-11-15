import React from 'react';

// Define the error props type
type ErrorProps = {
  errorMessage: string | null; // Can either be a string or null if no error
};

const ErrorComponent: React.FC<ErrorProps> = ({ errorMessage }) => {
  // If no error message is passed, return null (nothing to show)
  if (!errorMessage) return null;

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
      borderRadius: '4px',
      maxWidth: '400px',
      margin: '16px auto',
      fontFamily: 'Arial, sans-serif',
    }}>
      <strong>Error:</strong> {errorMessage}
    </div>
  );
};

export default ErrorComponent;
