'use client';

import {
    Grid,
    Stack,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useProfile from '@/hooks/use-profile';

interface SubAdmin {
    id: string;
    name: string;
    email: string;
    contact: string;
    dob: string;
    cnic: string;
}

function SubAdminPage() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {profile, errors, setProfile} = useProfile();

    useEffect(() => {

        
        const fetchSubAdmins = async () => {
            if (!profile) return false
            setLoading(true);

            try {
                const response: any = await axios.get(
                    'https://api-vehware-crm.vercel.app/api/credentials/admins',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${profile.token}`,

                        },
                    }
                );
                if (response.status === 200){
                    setSubAdmins(response.data.data.admins);
                }
            } catch (err) {
                setError('Failed to fetch data.');
            }
            setLoading(false);
        };

        fetchSubAdmins();
    }, [profile]);

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                <Typography color="error">{error}</Typography>
            </Grid>
        );
    }
    

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                 Department Managers
                </Typography>
            </Grid>

            {subAdmins?.length > 0 && subAdmins.map((subAdmin, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{subAdmin.name}</Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary="Email" secondary={subAdmin.email} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Contact" secondary={subAdmin.contact} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="DOB" secondary={subAdmin.dob} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="CNIC" secondary={subAdmin.cnic} />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default SubAdminPage;
