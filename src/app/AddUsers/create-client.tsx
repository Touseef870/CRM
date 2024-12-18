import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Typography } from '@mui/material';
import { Container } from '@mui/system';
import axios from 'axios';
import Swal from 'sweetalert2';

interface IFormInputs {
    email: string;
    name: string;
    phone: number;
    country: string;
   
    serviceType: string;
    dob: string;
}


const validationRules = {
    email: {
        required: "Email is required",
        pattern: {
            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: "Invalid email address",
        },
    },
    name: {
        required: "Name is required",
    },
    phone: {
        required: "Phone number is required",
       
    },
    country: {
        required: "Country is required",
    },
   
    serviceType: {
        required: "Service type is required",
    },
    dob: {
        required: "Date of birth is required",
        validate: (value: string) => value !== "" || "Invalid date format (yyyy-mm-dd)",
    },
};

const ClientForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IFormInputs>({
        mode: 'onBlur',  
    });

    const onSubmit = async (data: IFormInputs) => {
        try {
            const adminLoginData: string | null = localStorage.getItem('AdminloginData');
            const token = adminLoginData ? JSON.parse(adminLoginData).token : null;
    
            if (!token) {
                Swal.fire({
                    title: "Error",
                    text: "Authorization token is missing",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }
    
            console.log("Data sent to server:", data);
    
            const response = await axios.post(
                'https://api-vehware-crm.vercel.app/api/auth/create-client',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Server response:", response.data);
    
            Swal.fire({
                title: "Client Added Successfully",
                icon: "success",
                confirmButtonText: "OK",
            });
    
            reset();
        } catch (error: any) {
            console.error("Error:", error);
    
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Internal Server Error",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };
    
    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 4 } }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.8rem', sm: '3rem' }, // Adjust font size based on screen size
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                    paddingBottom: 2,
                    mb: 2,
                }}
            >
                Add Client
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%',  display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Controller
                    name="email"
                    control={control}
                    rules={validationRules.email}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            variant="outlined"
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="name"
                    control={control}
                    rules={validationRules.name}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Name"
                            variant="outlined"
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="phone"
                    control={control}
                    rules={validationRules.phone}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Phone"
                            variant="outlined"
                            error={Boolean(errors.phone)}
                            helperText={errors.phone?.message}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="country"
                    control={control}
                    rules={validationRules.country}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Country"
                            variant="outlined"
                            error={Boolean(errors.country)}
                            helperText={errors.country?.message}
                            fullWidth
                        />
                    )}
                />

                

                <FormControl fullWidth>
                    <InputLabel>Service Type</InputLabel>
                    <Controller
                        name="serviceType"
                        control={control}
                        rules={validationRules.serviceType}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Service Type"
                                error={Boolean(errors.serviceType)}
                            >
                                <MenuItem value="website">Website</MenuItem>
                                <MenuItem value="logo">Logo</MenuItem>
                            </Select>
                        )}
                    />
                    {errors.serviceType ? <FormHelperText error>{errors.serviceType?.message}</FormHelperText> : null}
                </FormControl>

                <Controller
                    name="dob"
                    control={control}
                    rules={validationRules.dob}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Date of Birth"
                            variant="outlined"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={Boolean(errors.dob)}
                            helperText={errors.dob?.message}
                            fullWidth
                        />
                    )}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default ClientForm;
