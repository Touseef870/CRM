'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import axios from 'axios';
import { type Integration } from '@/components/dashboard/branding/branding-card';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Card, CardContent, CardMedia, CircularProgress, Grid } from '@mui/material';
import AddBrand from '@/components/dashboard/branding/add-brand';
import Link from 'next/link';

export default function BrandingPage(): React.JSX.Element {
  const [brandingData, setBrandingData] = useState<Integration[]>([]);
  const [filteredBranding, setFilteredBranding] = useState<Integration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddBrandModal, setOpenAddBrandModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);



  const adminLoginData = localStorage.getItem('AdminloginData');
  if (!adminLoginData) {
    throw new Error('Admin login data is missing');
  }

  const parsedData = JSON.parse(adminLoginData);

  const itemsPerPage = 10; // Set to 10 items per page

  useEffect(() => {
    const fetchBrandingData = async () => {
      try {
        setLoading(true);
        setError(null);

        const skip = (currentPage - 1) * itemsPerPage;
        const limit = itemsPerPage;

        const response = await axios.get('https://api-vehware-crm.vercel.app/api/brand/get', {
          params: { skip, limit },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${parsedData.token}`,
          },
        });

        const fetchedData = response.data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          logo: item.image,
          updatedAt: new Date(),
        }));

        setBrandingData(fetchedData);
        setFilteredBranding(fetchedData);
        setTotalItems(response.data.totalItems);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchBrandingData();
  }, [currentPage]);


  const handleOpenAddBrandModal = () => {
    setOpenAddBrandModal(true);
  };

  const handleCloseAddBrandModal = () => {
    setOpenAddBrandModal(false);
  };


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
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Branding</Typography>
        </Stack>
        <div>
          <Button color='primary' startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpenAddBrandModal}>
            Add
          </Button>
        </div>
      </Stack>

      <div style={{ position: 'relative', display: 'inline-block', width: '30%' }}>
        <input
          type="text"
          placeholder="Search by brand name"
          onChange={(e) => { handleBrandEmploy(e.target.value); }}
          style={{
            width: '90%',
            padding: '20px 25px 18px 40px',
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

      {
        loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh',
            }}
          >
            <CircularProgress size={50} color="primary" />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {
              filteredBranding.length && filteredBranding.map((branding) => (
                <Grid item key={branding.id} lg={4} md={6} xs={12}>
                  <Link href={'/dashboard/branding/brandingDetails'}>
                    <Card
                      sx={{
                        maxWidth: "100%",
                        boxShadow: 3,
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={branding.logo || "https://via.placeholder.com/300"}
                        alt={branding.title || "Brand Image"}
                        sx={{
                          objectFit: "cover",
                        }}
                      />
                      <CardContent sx={{ padding: 3 }}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            color: "#333",
                          }}
                        >
                          {branding.title || "Brand Title"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "1rem",
                            color: "#555",
                            lineHeight: 1.6,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {branding.description || "Brand description goes here."}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))
            }
            {
              !filteredBranding.length && <div>There is no data exist</div>
            }
          </Grid>
        )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={(totalItems / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          size="small"
        />
      </Box>

      {openAddBrandModal && (
        <AddBrand open={openAddBrandModal} handleClose={handleCloseAddBrandModal} />
      )}
    </Stack>
  );
}