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
    Snackbar,
    Alert
} from "@mui/material";
import { blueGrey, indigo, grey, teal } from "@mui/material/colors";

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
    const { id } = useParams<{ id: string }>();
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

            setSuccess("Employee deleted successfully.");
            setTimeout(() => {
                router.push("/dashboard/employ"); // Redirect to the employee list page
            }, 2000);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete employee.");
        }
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
                            margin: '0 auto'
                        }}
                    >
                        Employee Details
                    </Typography>
                </Grid>

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
                            }}
                        >
                            {employee.name}
                        </Typography>
                        <Typography color="textSecondary" variant="body2" sx={{ fontStyle: "italic" }}>
                            {employee.type.toUpperCase()}
                        </Typography>
                    </Card>
                </Grid>

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
                                        <strong>CNIC:</strong> {employee.cnic}
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

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleDelete}
                    >
                        Delete Employee
                    </Button>
                </Grid>
            </Grid>

            <Snackbar open={!!success} autoHideDuration={4000}>
                <Alert severity="success">{success}</Alert>
            </Snackbar>
            <Snackbar open={!!deleteError} autoHideDuration={4000}>
                <Alert severity="error">{deleteError}</Alert>
            </Snackbar>
        </Box>
    );
}
