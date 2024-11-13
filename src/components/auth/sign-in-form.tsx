'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Ensure axios is imported
import RouterLink from 'next/link';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';

export function SignInForm(): React.JSX.Element {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('AdminloginData');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        saveToLocalStorage('AdminloginData', response.data.data);
        window.location.href = '/dashboard'; 
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Sign in
      </Typography>
      <form onSubmit={handleSignIn}>
        <Stack spacing={2}>
          {/* Email input */}
          <FormControl fullWidth>
            <InputLabel>Email address</InputLabel>
            <OutlinedInput
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              label="Email address"
              type="email"
            />
          </FormControl>

          {/* Password input */}
          <FormControl fullWidth>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              endAdornment={
                showPassword ? (
                  <EyeIcon
                    cursor="pointer"
                    fontSize="var(--icon-fontSize-md)"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeSlashIcon
                    cursor="pointer"
                    fontSize="var(--icon-fontSize-md)"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
              label="Password"
              type={showPassword ? 'text' : 'password'}
            />
          </FormControl>

          {/* Forgot password link */}
          <div>
            <Link component={RouterLink} href="/reset-password" variant="subtitle2">
              Forgot password?
            </Link>
          </div>

          {/* Sign-in button */}
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}


// email: admin@gmail.com
// password: Admin11@#