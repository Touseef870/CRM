import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Grid, Typography, InputAdornment, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import axios from "axios";
import Swal from "sweetalert2";
const validationRules = {
    email: {
        required: "Email is required",
        pattern: {
            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: "Invalid email address",
        },
    },
    password: {
        required: "Password is required",
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
    },
    name: {
        required: "Name is required",
    },
    phone: {
        required: "Phone number is required",
        minLength: {
            value: 11,
            message: "Phone number must be at least 11 digits",
        },
        maxLength: {
            value: 11,
            message: "Phone number must be no more than 11 digits",
        },

    },
    cnic: {
        required: "CNIC is required",
        minLength: {
            value: 13,
            message: "CNIC must be 13 digits",
        },
        maxLength: {
            value: 13,
            message: "CNIC must be 13 digits",
        },
        pattern: {
            value: /^[0-9]{13}$/,
            message: "CNIC must be numeric",
        },
    },
    gender: {
        required: "Gender is required",
    },
    salary: {
        required: "Salary is required",
        min: {
            value: 0,
            message: "Salary must be a positive number",
        },
    },
    dob: {
        required: "Date of birth is required",
        validate: (value: string) => value !== "" || "Invalid date format (yyyy-mm-dd)",
    },
};

interface FormData {
    email: string;
    password: string;
    name: string;
    phone: number;
    cnic: number;
    gender: "male" | "female" | "custom";
    salary: number;
    dob: string;
    type: "employee";
    isDeleted?: boolean;
    addedBy: string;
}

function AddEmployeeForm() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            data.type = 'employee'


           
            console.log(data);
            const adminLoginData: string | null = localStorage.getItem('AdminloginData');
           
            const res = axios.post('https://api-vehware-crm.vercel.app/api/auth/signup', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(adminLoginData!).token}`,
                },
            })
                .then((res) => {
                    console.log(res.data)
                    Swal.fire({
                        title: "Success",
                        text: "Employee added successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                }).catch((e) => {
                    console.log(e.response.data)
                    Swal.fire({
                        title: "Error",
                        text: e.response.data.error,
                        icon: "error",
                        confirmButtonText: "OK",
                    })
                })

            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 8 } }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.8rem', sm: '3rem' }, // Adjust font size based on screen size
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                    paddingBottom: 2,
                    mb: 3,
                }}
            >
                Add Employee
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            fullWidth
                            variant="outlined"
                            {...register("email", validationRules.email)}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                  
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
                            fullWidth
                            variant="outlined"
                            {...register("password", validationRules.password)}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => { setShowPassword(!showPassword); }} // Toggle visibility
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon fontSize="small" />
                                            ) : (
                                                <EyeIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                  
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            {...register("name", validationRules.name)}
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                 
                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            type="number"
                            fullWidth
                            variant="outlined"
                            {...register("phone", validationRules.phone)}
                            error={Boolean(errors.phone)}
                            helperText={errors.phone?.message}
                        />
                    </Grid>

                   
                    <Grid item xs={12}>
                        <TextField
                            label="CNIC"
                            type="number"
                            fullWidth
                            variant="outlined"
                            {...register("cnic", validationRules.cnic)}
                            error={Boolean(errors.cnic)}
                            helperText={errors.cnic?.message}
                        />
                    </Grid>

                  
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" error={Boolean(errors.gender)}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                label="Gender"
                                {...register("gender", validationRules.gender)}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </Select>
                            <FormHelperText>{errors.gender?.message}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Salary"
                            type="number"
                            fullWidth
                            variant="outlined"
                            {...register("salary", validationRules.salary)}
                            error={Boolean(errors.salary)}
                            helperText={errors.salary?.message}
                        />
                    </Grid>

                  
                    <Grid item xs={12}>
                        <TextField
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            variant="outlined"
                            {...register("dob", validationRules.dob)}
                            error={Boolean(errors.dob)}
                            helperText={errors.dob?.message}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                  
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Add Employee"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default AddEmployeeForm;
