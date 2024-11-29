'use client';

import React, { useState } from 'react';
import axios from 'axios';
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
import Swal from 'sweetalert2';

export function SignInForm(): React.JSX.Element {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Reset error for the field being modified
    setError((prevError) => ({
      ...prevError,
      [name]: '',
    }));
  };

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password } = loginData;

    // Basic client-side validation
    if (!email) {
      setError((prevError) => ({ ...prevError, email: 'Email is required' }));
      return;
    }
    if (!password) {
      setError((prevError) => ({ ...prevError, password: 'Password is required' }));
      return;
    }
    
    

    try {
      const response = await axios.post(
        'https://api-vehware-crm.vercel.app/api/auth/signin',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        saveToLocalStorage('AdminloginData', response.data.data);
        Swal.fire({
          title: "Successfully Created!",
          text: "Thank You",
          icon: "success",
        }).then((result) => {
          // Check if the user clicked 'OK'
          if (result.isConfirmed) {
            // Redirect after clicking 'OK'
            window.location.href = '/dashboard'; 
          }
        });
      }
      
    } catch (error: any) {
      // Handle error from API response
      if (error.response?.data?.message === 'Invalid email or password') {
        // If both email and password are incorrect, show errors for both fields
        setError({
          email: 'Invalid email or password', // Show general error for both fields
          password: 'Invalid email or password',
        });
      } else {
        // If any other error occurs, display a general error for both fields
        setError({
          email: 'An error occurred. Please try again later.',
          password: 'An error occurred. Please try again later.',
        });
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Sign in
      </Typography>
      <form onSubmit={handleSignIn}>
        <Stack spacing={2}>
          <FormControl fullWidth error={Boolean(error.email)}>
            <InputLabel>Email address</InputLabel>
            <OutlinedInput
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              label="Email address"
              type="email"
            />
            {error.email ? <Typography variant="body2" color="error">
                {error.email}
              </Typography> : null}
          </FormControl>

          <FormControl fullWidth error={Boolean(error.password)}>
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
                    onClick={() => { setShowPassword(false); }}
                  />
                ) : (
                  <EyeSlashIcon
                    cursor="pointer"
                    fontSize="var(--icon-fontSize-md)"
                    onClick={() => { setShowPassword(true); }}
                  />
                )
              }
              label="Password"
              type={showPassword ? 'text' : 'password'}
            />
            {error.password ? <Typography variant="body2" color="error">
                {error.password}
              </Typography> : null}
          </FormControl>
          <div>
            <Link component={RouterLink} href="/reset-password" variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
