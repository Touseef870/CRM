'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import axios from 'axios';
import { BrandingCard, type Integration } from '@/components/dashboard/branding/branding-card';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';


export default function BrandingPage(): React.JSX.Element {
  const [brandingData, setBrandingData] = useState<Integration[]>([]);
  const [filteredBranding, setFilteredBranding] = useState<Integration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  // Fetch branding data from the API
  useEffect(() => {
    const fetchBrandingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const adminLoginData = localStorage.getItem('AdminloginData');
        if (!adminLoginData) {
          throw new Error('Admin login data is missing');
        }

        const parsedData = JSON.parse(adminLoginData);

        const response = await axios.get('https://api-vehware-crm.vercel.app/api/brand/get', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${parsedData.token}`,
          },
        });

        // Transform the API response to match the Integration interface
        const fetchedData = response.data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          logo: item.img,
          installs: 0, // Assuming installs are not provided
          updatedAt: new Date(), // Assuming current time for demonstration
        }));

        setBrandingData(fetchedData);
        setFilteredBranding(fetchedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchBrandingData();
  }, []);

  const handleBrandEmploy = (value: string) => {
    const filteredData = brandingData.filter((brand) =>
      brand.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBranding(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBranding.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Branding</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>

      <div style={{ position: 'relative', display: 'inline-block', width: '30%', }}>
      <input
        type="text"
        placeholder="Search by brand name"
        onChange={(e) => { handleBrandEmploy(e.target.value); }}
        style={{
          width: '100%',
          padding: '14px 20px 12px 40px', // Add padding for the icon
          fontSize: '14px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '16px',
        }}
      />
      <MagnifyingGlassIcon
        size={20}
        weight="bold"
        style={{
          position: 'absolute',
          top: '40%',
          left: '10px',
          transform: 'translateY(-50%)',
          color: '#ccc',
        }}
      />
    </div>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {currentItems.map((branding) => (
            <Grid key={branding.id} lg={4} md={6} xs={12}>
              <BrandingCard integration={branding} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredBranding.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          size="small"
        />
      </Box>
    </Stack>
  );
}
