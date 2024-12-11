"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress, Card, CardContent, CardMedia, Alert } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const BrandingDetails = ({params} : any): React.JSX.Element => {
  const id  = params['id'];
  // const router = useRouter();
  console.log('id', id) 
  
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  
  const adminLoginData = localStorage.getItem('AdminloginData');
  if (!adminLoginData) {
    throw new Error('Admin login data is missing');
  }

  const parsedData = JSON.parse(adminLoginData);

  useEffect(() => {
    if (!id) return;

    const fetchBrandDetails = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`https://api-vehware-crm.vercel.app/api/brand/get/${id}`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${parsedData.token}`,
        //   },
        // });
        // setBranding(response.data.data);
        setBranding({
          _id: "67575ebf76b58eada3b61473",
          title: "Vehware",
          imgUrl: "https://images.unsplash.com/photo-1719937050792-a6a15d899281?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          description: "portable disk in high quality",
          createdAt: "2024-12-09T21:18:55.017Z"
      });
        setLoading(false);
      } catch (err) {
        // setError('Failed to fetch brand details');
        setLoading(false);
      }
    };

    fetchBrandDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      const response : any = await axios.delete(`https://api-vehware-crm.vercel.app/api/brand/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parsedData.token}`,
        },
      });
      let resp = response.data
      if (resp.status === 200) {
        // here can be logic after deleted brands
        return; 
      }
      // here can be write logic if something error to delete data
    } catch (err) {
      setError('There are some critical issue during delete data. please try again later!');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: '100%', boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="300"
          image={branding?.imgUrl || 'https://via.placeholder.com/300'}
          alt={branding?.title || 'Brand Image'}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {branding?.title || 'Brand Title'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
            {branding?.description || 'Brand description goes here.'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Brand'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BrandingDetails;
