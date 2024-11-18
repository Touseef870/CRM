'use client'

import React from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import AddEmployeeForm from './create-employee';
import ClientForm from './create-client';

export default function Page() {
  const searchParams = useSearchParams(); // Using useSearchParams to access query params
  const slug = searchParams.get('slug') || 'create-sub-admin'; // Default to 'create-sub-admin' if slug is not found

  // Render the component based on the slug
  switch (slug) {
    case 'create-sub-admin':
      return <UserForm />;
    case 'create-employee':
      return <AddEmployeeForm />;
    case 'create-client': // Fixed typo here
      return <ClientForm />;
    default:
      return <div>Select a component from the layout</div>;
  }
}
