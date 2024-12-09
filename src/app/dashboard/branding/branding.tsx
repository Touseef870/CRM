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
import { BrandingCard, type Integration } from '@/components/dashboard/branding/branding-card';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Card, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';


export default function BrandingPage(): React.JSX.Element {
  const [brandingData, setBrandingData] = useState<Integration[]>([]);
  const [filteredBranding, setFilteredBranding] = useState<Integration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null as any, 
    description: '',
  });

  console.log(brandingData)

  const itemsPerPage = 6;

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

        const fetchedData = response.data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          logo: item.img,
          installs: 0,
          updatedAt: new Date(), 
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

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = () => {
    console.log(formData); 
    handleCloseModal(); 
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
          <Button color='primary' startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpenModal} >
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
      {loading ? (
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
          {currentItems.map((branding) => (
            <Grid item key={branding.id} lg={4} md={6} xs={12}>
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

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Add Brand</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleFormChange}
          />
          <div style={{ marginBottom: '16px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="image-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload">
              <Button
                component="span"
                startIcon={<CloudUploadIcon />}
                variant="outlined"
                fullWidth
                sx={{ textAlign: 'center' }}
              >
                {formData.image ? 'Image Selected' : 'Select Image'}
              </Button>
            </label>
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: '16px' }} />}
          </div>
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
