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
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useParams } from "next/navigation";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

// Define Params type
interface Params {
  id?: string;
}

const BrandingDetails = (): React.JSX.Element | null => {
  const params = useParams() as Params;
  const id = params?.id;

  const [branding, setBranding] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
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
    if (!id || deleted) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);

        // Fetch branding details
        const brandingResponse = await axios.get(
          `https://api-vehware-crm.vercel.app/api/brand/get/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedData.token}`,
            },
          }
        );
        setBranding(brandingResponse.data.data);

        // Fetch order details
        const orderResponse = await axios.get(
          `https://api-vehware-crm.vercel.app/api/brand/visualizedBrand/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedData.token}`,
            },
          }
        );
        setOrderDetails(orderResponse.data.data.visualizedBrand);
        console.log(orderResponse.data.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to fetch brand or order details");
      }
    };

    fetchDetails();
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
        router.push("/dashboard/branding");
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
        Swal.fire("Cancelled", "The brand was not deleted.", "info");
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
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
    return null;
  }

  if (!branding) {
    return null;
  }

  return (
    <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Branding Info Card */}
      <Card sx={{ width: { xs: '100%', sm: 600, md: 700 }, boxShadow: 3, borderRadius: 2, overflow: "hidden", marginBottom: 3 }}>
        <CardMedia
          component="img"
          width="100%"
          height="300"
          image={branding?.image || "https://via.placeholder.com/300"}
          alt={branding?.title || "Brand Image"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            {branding?.title || "Brand Title"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, textAlign: "center" }}>
            {branding?.description || "Brand description goes here."}
          </Typography>


          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={confirmDelete}
              disabled={deleting}
              sx={{
                color: "error.main",
                padding: 1,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Order Details Section */}
      {orderDetails?.length > 0 ? (
        <TableContainer component={Paper} sx={{ width: "100%", marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="order details table">
            {/* Table Header */}
            <TableHead sx={{ backgroundColor: "primary.main", color: "white" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Discounted Price</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Client ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Created At</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {orderDetails.map((order: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)", // Hover effect
                    },
                    backgroundColor: index % 2 === 0 ? "rgba(255, 255, 255, 0.8)" : "transparent", // Zebra striping
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                    {order?.title || "No title available"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                    {order?.description || "No description available"}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "500",
                      color: order?.status === "PENDING" ? "warning.main" :
                        order?.status === "SUCCESS" ? "success.main" :
                          order?.status === "FAILED" ? "error.main" :
                            order?.status === "CANCELED" ? "error.main" :
                              "text.secondary", // Default color if status is not recognized
                    }}
                  >
                    {order?.status || "No status available"}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                    {order?.price || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                    {order?.discountPrice || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                    {order?.clientId || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500" }}>
                    {new Date(order?.createdAt).toLocaleString() || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">No orders found</Typography>
      )}
    </Box>
  );

};
export default BrandingDetails;