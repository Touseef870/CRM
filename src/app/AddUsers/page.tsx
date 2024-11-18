'use client'

import React from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import AddEmployeeForm from './create-employee';
import ClientForm from './craete-client';

export default function Page() {
  const searchParams = useSearchParams(); // Using useSearchParams to access query params
  const slug = searchParams.get('slug'); // Accessing the slug query parameter

  // Render the component based on the slug
  if (slug) {
    switch (slug) {
      case 'create-sub-admin':
        return <UserForm />;
      case 'create-employee':
        return <AddEmployeeForm />;
        case 'craete-client':
        return <ClientForm />;
      default:
        return <div>Select a component from the layout</div>;
    }
  }

  return (
    <div>
      {/* Loading state with margin top styling */}
      Loading...
    </div>
  );
}
