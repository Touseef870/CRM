
'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon
import { blueGrey, grey, teal } from "@mui/material/colors";

// Define Employee interface
interface Employee {
  _id: string;
  cnic: string;
  dob: string;
  email: string;
  gender: string;
  name: string;
  phone: string;
  salary: number;
  type: string;
  avatar?: string;
  amount?: number;
  serviceType: string;
}

export default function EmployeeDetails() {
  const params = useParams();
  const id = params?.id; // Handle the case where `id` may be null

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // To redirect after deletion
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null); // For delete errors

  useEffect(() => {
    if (!id) {
      setError("Employee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        const adminLoginData = localStorage.getItem("AdminloginData");

        if (!adminLoginData) {
          throw new Error("Admin login data is missing");
        }

        const parsedData = JSON.parse(adminLoginData);

        if (!parsedData.token) {
          throw new Error("Token is missing in admin login data");
        }

        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/credentials/client/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedData.token}`,
            },
          }
        );

        setEmployee(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    try {
      const adminLoginData = localStorage.getItem("AdminloginData");

      if (!adminLoginData) {
        throw new Error("Admin login data is missing");
      }

      const parsedData = JSON.parse(adminLoginData);

      if (!parsedData.token) {
        throw new Error("Token is missing in admin login data");
      }

      await axios.delete(
        `https://api-vehware-crm.vercel.app/api/auth/delete-client/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedData.token}`,
          },
        }
      );

      alert("Employee deleted successfully.");
      setEmployee(null);
      setTimeout(() => {
        router.push("/dashboard/employ"); // Redirect to the employee list page
      }, 2000);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete the employee");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          Employee not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: grey[100] }}>
      <Grid container spacing={4} maxWidth="lg">
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: teal[700],
                textTransform: "uppercase",
                letterSpacing: "2px",
                margin: "0 auto",
              }}
            >
              Client Details
            </Typography>
            <IconButton
              onClick={handleDelete}
              sx={{
                color: teal[700],
                "&:hover": {
                  backgroundColor: teal[50],
                },
              }}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
        </Grid>

        {/* Avatar and Name */}
        <Grid item xs={12} sm={4} md={3}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
              textAlign: "center",
              height: "100%",
              boxShadow: 4,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              border: `1px solid ${grey[300]}`,
              "&:hover": {
                boxShadow: 8,
              },
            }}
          >
            <Avatar
              src={employee.avatar || ""}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                bgcolor: teal[500],
                color: "common.white",
                fontSize: "2.5rem",
                fontWeight: "bold",
                border: `4px solid #ffffff`,
                boxShadow: 3,
                "@media (max-width:600px)": {
                  width: 100,
                  height: 100,
                },
              }}
            >
              {employee.name.charAt(0)}
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: teal[800],
                textTransform: "capitalize",
              }}
            >
              {employee.name}
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ fontStyle: "italic" }}>
              {employee.type.toUpperCase()}
            </Typography>
          </Card>
        </Grid>

        {/* Employee Info */}
        <Grid item xs={12} sm={8} md={9}>
          <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#ffffff" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: teal[700],
                }}
              >
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: grey[300] }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: grey[700] }}>
                    <strong>Service:</strong> {employee.serviceType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: grey[700] }}>
                    <strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: grey[700] }}>
                    <strong>Email:</strong> {employee.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: grey[700] }}>
                    <strong>Phone:</strong> {employee.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: grey[700] }}>
                    <strong>Amount:</strong> {employee.amount}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {deleteError ? <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {deleteError}
        </Typography> : null}
    </Box>
  );
}
