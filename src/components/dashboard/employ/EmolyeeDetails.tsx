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

    Snackbar,
    Alert,
    IconButton
} from "@mui/material";
import { blueGrey, indigo, grey, teal } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon
import Swal from "sweetalert2";
import { FiTrash } from 'react-icons/fi'; // Import the trash icon

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
}

export default function EmployeeDetails() {
    const { id } = useParams<{ id: string }>() || {}; // Make sure to destructure it properly or set a fallback
    const router = useRouter(); // To redirect after deletion
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
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
                    `https://api-vehware-crm.vercel.app/api/credentials/employee/${id}`,
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

        if (id) {
            fetchEmployee();
        }
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
                `https://api-vehware-crm.vercel.app/api/auth/delete/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${parsedData.token}`,
                    },
                }
            );

            setLoading(false); // Stop loading indicator
            setSuccess("Employee deleted successfully.");
            Swal.fire("Deleted!", "Employee deleted successfully.", "success");
            setTimeout(() => {
                router.push("/dashboard/employ"); // Redirect to the employee list page
            }, 2000);
        } catch (err) {
            setLoading(false); // Stop loading indicator
            setDeleteError(err instanceof Error ? err.message : "Failed to delete employee.");
            Swal.fire("Error", err instanceof Error ? err.message : "Failed to delete employee.", "error");
        }
    };

    const handleDeleteConfirmation = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this employee? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(); // Call the delete function if confirmed
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your employee is safe.", "info");
            }
        });
    };

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
                {/* Title Section */}
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                            color: teal[700],
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            margin: '0 auto',
                            mb: 3
                        }}
                    >
                        Employee Details
                    </Typography>
                </Grid>

                {/* Delete Button */}
                <Grid item xs={12}>
                    <IconButton
                        onClick={handleDeleteConfirmation}
                        sx={{
                            color: teal[700],
                            "&:hover": {
                                backgroundColor: teal[50],
                            },
                            marginBottom: 2
                        }}
                    >
                        <FiTrash size={24} />
                    </IconButton>
                </Grid>

                {/* Avatar and Name Section */}
                <Grid item xs={12} sm={6} md={4}>
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
                            '&:hover': { boxShadow: 8 },
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
                                marginBottom: 1,
                            }}
                        >
                            {employee.name}
                        </Typography>
                        <Typography color="textSecondary" variant="body2" sx={{ fontStyle: "italic" }}>
                            {employee.type.toUpperCase()}
                        </Typography>
                    </Card>
                </Grid>

                {/* Personal Information Section */}
                <Grid item xs={12} sm={6} md={8}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#ffffff" }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    color: teal[700],
                                    marginBottom: 2,
                                }}
                            >
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: grey[300] }} />
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>CNIC:</strong> {employee.cnic}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700], textWrap: "wrap" }}>
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
                                        <strong>Gender:</strong> {employee.gender}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Salary:</strong> {`$${employee.salary.toLocaleString()}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Error / Success Message */}
                {deleteError ? (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {deleteError}
                    </Typography>
                ) : null}

                <Snackbar open={Boolean(success)} autoHideDuration={4000}>
                    <Alert severity="success">{success}</Alert>
                </Snackbar>
                <Snackbar open={Boolean(deleteError)} autoHideDuration={4000}>
                    <Alert severity="error">{deleteError}</Alert>
                </Snackbar>
            </Grid>
        </Box>


    );
}