'use client';

import React, { useEffect, useState, Suspense } from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation';
import AddEmployeeForm from './create-employee';
import ClientForm from './create-client';
import { Typography, Box } from '@mui/material';

// Function to get user type from localStorage
const getUserType = () => {
  const adminData = localStorage.getItem('AdminloginData');
  return adminData ? JSON.parse(adminData).type : null;
};

// Function to render the correct form based on user type and slug
const renderForm = (userType: string | null, slug: string) => {
  switch (userType) {
    case 'admin':
      return renderAdminForm(slug);
    case 'employee':
      return renderEmployeeForm(slug);
    case 'sub-admin':
      return renderSubAdminForm(slug);
    default:
      return <Typography variant="h5" color="textPrimary">Please log in to continue</Typography>;
  }
};

// Function to render forms for 'admin' user type
const renderAdminForm = (slug: string) => {
  switch (slug) {
    case 'create-sub-admin':
      return <UserForm />;
    case 'create-employee':
      return <AddEmployeeForm />;
    case 'create-client':
      return <ClientForm />;
    default:
      return <Typography variant="h5" color="textPrimary">Select a component from the layout</Typography>;
  }
};

// Function to render forms for 'employee' user type
const renderEmployeeForm = (slug: string) => {
  if (slug === 'create-client' || !slug) {
    return <ClientForm />;
  }
  return <Typography variant="h5" color="textPrimary" sx={{ textAlign: 'center', marginTop: '50px' }}>
    You don't have permission to view this page
  </Typography>;
};

// Function to render forms for 'sub-admin' user type
const renderSubAdminForm = (slug: string) => {
  if (slug === 'create-employee') {
    return <AddEmployeeForm />;
  } 
  return <ClientForm />;
};

export default function Page() {
  const [userType, setUserType] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug') || 'create-client'; // Default slug

  // Get user type on mount
  useEffect(() => {
    setUserType(getUserType());
  }, []);

  // Wrapper to manage rendering of the forms
  const FormContent = () => (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      {renderForm(userType, slug)}
    </Suspense>
  );

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://img.freepik.com/free-vector/beautiful-grey-papercut-background_1035-14108.jpg?t=st=1732728284~exp=1732731884~hmac=fc3f54f6777af35af1a03cde2f21b2d8ca462ad124b168b672e62205a3d93643&w=740)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0px)',
          zIndex: 1,
          opacity: 0.5,
        }}
      />

      {/* Form Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          overflow: 'auto',
          padding: '10px',
        }}
      >
        <FormContent />
      </Box>
    </Box>
  );
}
