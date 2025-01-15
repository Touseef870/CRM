'use client';

import React, { useContext, useState } from 'react';
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
import { AppContext } from '@/contexts/isLogin';

export function SignInForm(): React.JSX.Element {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const { setStoredValue } = useContext(AppContext)!;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: '',
    }));
  };



  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true)
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
        setStoredValue(response.data.data);
        Swal.fire({
          title: "Successfully Created!",
          text: "Thank You",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/dashboard';
            setLoading(false)
          }
        });
      }

    } catch (error: any) {
      if (error.response?.data?.message === 'Invalid email or password') {
        setError({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
        });
        setLoading(false)
      } else {
        setError({
          email: 'An error occurred. Please try again later.',
          password: 'An error occurred. Please try again later.',
        });
        console.log('Error during login:', error);
        setLoading(false)
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
            <Link component={RouterLink} href="/auth/reset-password" variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }} disabled={loading}>
            {loading ?

              <div role="status" className="flex items-center justify-center gap-2">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="text-black">Loading...</span>
              </div>
              : 'Sign in'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
