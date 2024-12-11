"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Alert,
  IconButton,
} from "@mui/material";
import { useParams } from "next/navigation"; // Import useParams
import { Delete as DeleteIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

// Define the type for the params object
type Params = {
  id?: string; // 'id' can be undefined, depending on the URL
};

const BrandingDetails = (): React.JSX.Element  | null => {
  // Use useParams and explicitly type the return value
  const params = useParams() as Params;
  const id = params?.id; // Optional chaining to safely access 'id'
  
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const adminLoginData = localStorage.getItem("AdminloginData");
  if (!adminLoginData) {
    throw new Error("Admin login data is missing");
  }

  const parsedData = JSON.parse(adminLoginData);

  const router = useRouter();

  useEffect(() => {
    if (!id || deleted) return; // Avoid fetching if already deleted

    const fetchBrandDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/brand/get/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedData.token}`,
            },
          }
        );
        setBranding(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to fetch brand details");
      }
    };

    fetchBrandDetails();
  }, [id, deleted]);

  const handleDelete = async () => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    try {
      setDeleting(true);

      await axios.delete(
        `https://api-vehware-crm.vercel.app/api/brand/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedData.token}`,
          },
        }
      );

      Swal.fire("Deleted!", "Brand deleted successfully.", "success");
      setBranding(null);
      setDeleted(true);
      setDeleting(false);
      setTimeout(() => {
        router.push("/dashboard/branding"); // Redirect to branding page after 2 seconds
      }, 2000);
    } catch (err: any) {
      console.error("Error deleting the brand:", err.response?.data || err.message);
      setDeleting(false);
    }
  };



  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "The employee was not deleted.", "info");
      }
    });
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
  if (deleted) {
    return null; // Don't render anything if deleted
  }


  // If branding is null, don't render anything
  if (!branding) {
    return null;
  }
  return (
    <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
    <Card sx={{ width: 500, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
      <CardMedia
        component="img"
        width="100%" // Ensures it takes full width of the card
        height="300" // Fixed height for the image
        image={branding?.image || 'https://via.placeholder.com/300'}
        alt={branding?.title || 'Brand Image'}
        sx={{
          objectFit: 'cover', // Ensures image doesn't stretch, it covers the area neatly
        }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {branding?.title || 'Brand Title'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, textAlign: 'center' }}>
          {branding?.description || 'Brand description goes here.'}
        </Typography>
  
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={confirmDelete}
            disabled={deleting}
            sx={{
              color: 'error.main',
              padding: 1,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  </Box>
  
  
  );
};

export default BrandingDetails;