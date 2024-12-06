'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, CardActions, IconButton, Divider, Avatar, Grid, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import EmolyeeAttendace from '../../employ/[id]/EmployeeAttendance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Subadmin {
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

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(8),
    backgroundColor: '#f4f4f9',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 900,
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    padding: theme.spacing(3),
    transition: 'all 0.3s ease',
    marginBottom: theme.spacing(4),
    position: 'relative',

}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    marginBottom: theme.spacing(2),
    border: '4px solid skyblue', // Sky blue border
    backgroundColor: '#1976d2', // Existing background color
    borderRadius: '50%', // Ensures it stays circular
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Adds a soft shadow for better emphasis
    transition: 'transform 0.3s ease', // Adds smooth animation on hover
    '&:hover': {
        transform: 'scale(1.1)', // Slightly enlarges the avatar on hover
    }
}));


const CardHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'space-between',
    marginBottom: theme.spacing(5),
    textAlign: 'left',
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    fontWeight: 500,
    fontSize: '1rem',
    color: '#333',
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#d32f2f',
    fontSize: '1.8rem',
    '&:hover': {
        color: '#b71c1c',
    },
}));





function Page() {
    const params = useParams();
    const id = params?.id;
    const [subadmin, setSubAdmins] = useState<Subadmin | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Subadmin ID is missing.");
            setLoading(false);
            return;
        }

        const fetchSubadmin = async () => {
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
                    `https://api-vehware-crm.vercel.app/api/credentials/admin/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${parsedData.token}`,
                        },
                    }
                );
                setSubAdmins(response.data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchSubadmin();
    }, [id]);

    const handleDelete = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const adminLoginData: string | null = localStorage.getItem('AdminloginData');

                    if (adminLoginData) {
                        const token = JSON.parse(adminLoginData).token;

                        const response = await axios.delete(
                            `https://api-vehware-crm.vercel.app/api/auth/delete/${id}`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (response.status === 200) {
                            Swal.fire('Deleted!', 'The sub-admin has been deleted.', 'success');
                        }
                    }
                } catch (err) {
                    setError('Failed to delete the sub-admin.');
                    Swal.fire('Error!', 'There was an issue deleting the sub-admin.', 'error');
                }
                setLoading(false);
            }
        });
    };


    function handleback() {
        window.history.back();
    }



    if (loading) {
        return (
            <Container>
                <CircularProgress size={60} color="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    if (!subadmin) {
        return (
            <Container>
                <Typography variant="h6">No Subadmin Found</Typography>
            </Container>
        );
    }

    return (
        <>

            <Box sx={{ position: "relative" }}>
                <Button
                    onClick={handleback}
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 2,
                        padding: "12px 16px",  // Increase padding for bigger button size
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "8px",
                        color: "#1976d2",  // Default blue color for text
                        fontSize: "22px",   // Increase font size for bigger text
                        "&:hover": {
                            color: "#005bb5", // Dark blue on hover for text color
                        },
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: "24px" }} />  {/* Increase icon size */}
                </Button>

            </Box>


            <Container>

                <StyledCard>
                    <CardHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AvatarStyled
                                src={subadmin.avatar || '/default-avatar.jpg'}
                                alt={subadmin.name}
                            />
                            <Box sx={{ marginLeft: 2 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    {subadmin.name}
                                </Typography>
                            </Box>
                        </Box>
                        <DeleteButton onClick={handleDelete}>
                            <DeleteIcon />
                        </DeleteButton>
                    </CardHeader>
                    <Divider sx={{ marginBottom: 2 }} />
                    <CardContentStyled>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TypographyStyled>
                                    <strong>Email:</strong> {subadmin.email}
                                </TypographyStyled>
                                <TypographyStyled>
                                    <strong>Gender:</strong> {subadmin.gender}
                                </TypographyStyled>
                                <TypographyStyled>
                                    <strong>Phone:</strong> {subadmin.phone}
                                </TypographyStyled>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TypographyStyled>
                                    <strong>Salary:</strong> ${subadmin.salary}
                                </TypographyStyled>
                                <TypographyStyled>
                                    <strong>Date of Birth:</strong> {new Date(subadmin.dob).toLocaleDateString()}
                                </TypographyStyled>
                            </Grid>
                        </Grid>
                    </CardContentStyled>
                </StyledCard>

                <StyledCard>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                        Employee Attendance
                    </Typography>
                    <Divider />
                    <Box mt={2}>
                        <EmolyeeAttendace />
                    </Box>
                </StyledCard>
            </Container>


        </>


    );
}

export default Page;
