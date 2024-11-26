'use client';

import React from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation';
import AddEmployeeForm from './create-employee';
import ClientForm from './create-client';
import { Typography, Box, Paper } from '@mui/material';

export default function Page() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'create-client';

  const adminData = localStorage.getItem('AdminloginData');
  const parsedAdminData = adminData ? JSON.parse(adminData) : null;
  const userType = parsedAdminData?.type;

  const renderForm = () => {
    if (userType === 'admin') {
      switch (slug) {
        case 'create-sub-admin':
          return <UserForm />;
        case 'create-employee':
          return <AddEmployeeForm />;
        case 'create-client':
          return <ClientForm />;
        default:
          return (
            <Typography variant="h5" color="textPrimary">
              Select a component from the layout
            </Typography>
          );
      }
    } else if (userType === 'employee') {
      if (slug === 'create-client' || !slug) {
        return <ClientForm />;
      } else {
        return (
          <Typography
            variant="h5"
            color="textPrimary"
            sx={{ textAlign: 'center', marginTop: '50px' }}
          >
            You don't have permission to view this page
          </Typography>
        );
      }
    } else {
      return <div>Please log in to continue</div>;
    }
  };

  return (
    <Box
    sx={{
      height: '100vh',
      position: 'relative', // Set the container as relative for layering
   // Keep the background from overflowing
    }}
  >
    {/* Blurred Background Image */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://img.freepik.com/premium-photo/question-mark-sticky-note-with-business-objects_220873-10267.jpg)', // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(2px)', // Blur the background
        zIndex: 1, // Layer it below the form
      }}
    />
  
    {/* Form Container */}
    <Box
      sx={{
        position: 'relative',
        zIndex: 8, // Ensure it sits above the background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Full height for alignment
        overflow: 'auto', // Enable scrolling if content exceeds viewport
        padding: '10px', // Add padding for better spacing
      }}
    >
      {renderForm()} {/* Render the form as it is */}
    </Box>
  </Box>
  
  );
  
}
