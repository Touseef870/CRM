'use client'

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';


export function AccountInfo(): React.JSX.Element {
  const [loginData, setLoginData] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fetch data from localStorage
      const storedData = localStorage.getItem('AdminloginData');
      if (storedData) {
        setLoginData(JSON.parse(storedData));
      }
    }
  }, []);

  const { name, email, phone, cnic, salary, gender, dob } = loginData || {};

  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 1,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'white',
        padding: 13,
        transition: '0.3s ease-in-out',
        '&:hover': {
          boxShadow: 10,
        },
      }}
    >
      <CardContent>
        {/* Profile Avatar */}
        <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 200,
              height: 200,
              mb: 2,
              bgcolor: blue[800], // Lighter blue
              color: 'common.white',
              fontSize: '4rem',
              fontWeight: 'bold',
              boxShadow: 3,
              transition: '0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: blue[200], // Slightly darker blue on hover
              },
              '@media (max-width:600px)': {
                width: 100,
                height: 100,
              },
            }}
          >
            <PersonIcon fontSize="inherit" />
          </Avatar>

          {/* Name */}
          <Typography variant="h4" sx={{ fontWeight: '800', color: blue[800] }}>
            {name || 'No Name Available'}
          </Typography>

          {/* Details */}
          {/* <Stack spacing={1} sx={{ width: '100%' }}>
            <Typography color="text.secondary" variant="body2">
              {email || 'No Email Available'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {phone || 'No Phone Available'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {cnic || 'No CNIC Available'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {salary || 'No Salary Available'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dob || 'No Date of Birth Available'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {gender || 'No Gender Available'}
            </Typography>
          </Stack> */}
        </Stack>
      </CardContent>
      <Divider sx={{ marginY: 2 }} />
    </Card>
  );
}
