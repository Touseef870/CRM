'use client';

import React, { useEffect, useState, Suspense } from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation';
import AddEmployeeForm from './create-employee';
import ClientForm from './create-client';
import { Typography, Box } from '@mui/material';

export default function Page() {
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug') || 'create-client'; // Nullish coalescing to handle null

  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const adminData = localStorage.getItem('AdminloginData');
    const parsedAdminData = adminData ? JSON.parse(adminData) : null;
    setUserType(parsedAdminData?.type || null); // Set user type from localStorage
  }, []);

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
      }
      return (
        <Typography
          variant="h5"
          color="textPrimary"
          sx={{ textAlign: 'center', marginTop: '50px' }}
        >
          You don't have permission to view this page
        </Typography>
      );
    } else {
      return <div>Please log in to continue</div>;
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        position: 'relative',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'url(https://img.freepik.com/free-vector/beautiful-grey-papercut-background_1035-14108.jpg?t=st=1732728284~exp=1732731884~hmac=fc3f54f6777af35af1a03cde2f21b2d8ca462ad124b168b672e62205a3d93643&w=740)', // Replace with your image URL
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0px)', // Blur the background
          zIndex: 1, // Layer it below the form
          opacity: 0.5, // Set the opacity of the background image (0.0 to 1.0)
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
        {/* Wrap renderForm in Suspense */}
        <Suspense fallback={<Typography>Loading...</Typography>}>
          {renderForm()}
        </Suspense>
      </Box>
    </Box>
  );
}
