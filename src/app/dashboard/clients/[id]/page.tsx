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
import Swal from "sweetalert2"; // SweetAlert2 library
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
  serviceType: string;
  country: string;
}

export default function EmployeeDetails() {
  const params = useParams();
  const id = params?.id; // Handle the case where `id` may be null

  const [employee, setEmployee] = useState<Employee | null>(null);
  console.log(employee);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // To redirect after deletion
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
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
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

      Swal.fire("Deleted!", "Employee deleted successfully.", "success");
      setEmployee(null);
      setTimeout(() => {
        router.push("/dashboard/employ"); // Redirect to the employee list page
      }, 2000);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete the employee"
      );
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true, // Show the "No" (Cancel) button
      confirmButtonColor: "#d33", // Red color for the "Yes" button
      cancelButtonColor: "#3085d6", // Blue color for the "No" button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!", // Text for the "No" button
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks "Yes"
        handleDelete(); // Proceed with the deletion
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If the user clicks "No" (Cancel)
        Swal.fire("Cancelled", "The employee was not deleted.", "info");
      }
    });
  };


  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: grey[100],
        minHeight: "100vh",
      }}
    >
      <Grid
        container
        spacing={4}
        maxWidth="lg"
        sx={{ margin: "0 auto", width: "100%" }}
      >
        {/* Header */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: teal[700],
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Client Details
            </Typography>
            <IconButton
              onClick={confirmDelete}
              sx={{
                color: teal[700],
                "&:hover": {
                  backgroundColor: teal[50],
                  transform: "scale(1.1)",
                  transition: "0.3s",
                },
              }}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
        </Grid>
  
        {/* Avatar and Personal Information */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {/* Avatar and Name */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  boxShadow: 6,
                  borderRadius: 4,
                  background: `linear-gradient(to bottom, ${teal[50]}, #fff)`,
                  border: `1px solid ${grey[300]}`,
                  "&:hover": {
                    boxShadow: 10,
                  },
                }}
              >
                <Avatar
                  src={employee.avatar || ""}
                  sx={{
                    width: { xs: 100, sm: 140 },
                    height: { xs: 100, sm: 140 },
                    mb: 2,
                    bgcolor: teal[500],
                    color: "common.white",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    fontWeight: "bold",
                    border: 4,
                    boxShadow: 3,
                  }}
                >
                  {employee.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: teal[800],
                    textTransform: "capitalize",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {employee.name}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {employee.type.toUpperCase()}
                </Typography>
              </Card>
            </Grid>
  
            {/* Personal Information */}
            <Grid item xs={12} sm={8}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 4,
                  backgroundColor: "#ffffff",
                  p: 3,
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: teal[700],
                    mb: 2,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: grey[300] }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Service:</strong> {employee.serviceType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(employee.dob).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Email:</strong> {employee.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Phone:</strong> {employee.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Country:</strong> {employee.country}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  
      {/* Error Message */}
      {deleteError ? (
        <Typography
          variant="body2"
          color="error"
          sx={{
            mt: 3,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.75rem", sm: "1rem" },
          }}
        >
          {deleteError}
        </Typography>
      ) : null}
    </Box>
  );
  


}
