'use client'

import React from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation';
import AddEmployeeForm from './create-employee';
import ClientForm from './create-client';
import { Typography } from '@mui/material';

export default function Page() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'create-client'  ; 

  const adminData = localStorage.getItem('AdminloginData');

  const parsedAdminData = adminData ? JSON.parse(adminData) : null;
  const userType = parsedAdminData?.type;

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
        <Typography variant="h5" color="textPrimary" sx={{ textAlign: 'center', marginTop: '50px' }}>
          You don't have permission to view this page
        </Typography>
      );
    }
  } else {
    return <div>Please log in to continue</div>;
  }
}
