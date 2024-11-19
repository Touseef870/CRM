'use client';

import { useEffect, useState } from "react";

interface AdminLoginData {
  name: string;
  email: string;
}

interface GetAdminLoginDataProps {
  key: string;
}

export const getAdminLoginData = ({ key }: GetAdminLoginDataProps): AdminLoginData | null => {
  const [data, setData] = useState<AdminLoginData | null>(null);

  useEffect(() => {
    // Only run this on client-side (window object is available)
    const storedData = localStorage.getItem(key);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [key]); // Re-run when 'key' changes

  return data; // Return the data once it is loaded
};
