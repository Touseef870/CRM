import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Grid, Typography, InputAdornment, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import axios from "axios";
import Swal from "sweetalert2";
// Validation rules
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

type FormData = {
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
};

const AddEmployeeForm = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            data.type = 'employee'


            // Simulate form submission
            console.log(data);
            const adminLoginData: string | null = localStorage.getItem('AdminloginData');
            // send data to api using of axios
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
                    fontSize: { xs: '1.8rem', sm: '2.5rem' }, // Adjust font size based on screen size
                    color: 'primary.main',
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                    paddingBottom: 2,
                    fontFamily: 'cursive',
                    mb: 3,
                }}
            >
                Add Employee
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* Email Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            fullWidth
                            variant="outlined"
                            {...register("email", validationRules.email)}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    {/* Password Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
                            fullWidth
                            variant="outlined"
                            {...register("password", validationRules.password)}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
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

                    {/* Name Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            {...register("name", validationRules.name)}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    {/* Phone Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            type="number"
                            fullWidth
                            variant="outlined"
                            {...register("phone", validationRules.phone)}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>

                    {/* CNIC Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="CNIC"
                            type="number"
                            fullWidth
                            variant="outlined"
                            {...register("cnic", validationRules.cnic)}
                            error={!!errors.cnic}
                            helperText={errors.cnic?.message}
                        />
                    </Grid>

                    {/* Gender Field */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined" error={!!errors.gender}>
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

                    {/* Salary Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Salary"
                            type="number"
                            fullWidth
                            variant="outlined"
                            {...register("salary", validationRules.salary)}
                            error={!!errors.salary}
                            helperText={errors.salary?.message}
                        />
                    </Grid>

                    {/* Date of Birth Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            variant="outlined"
                            {...register("dob", validationRules.dob)}
                            error={!!errors.dob}
                            helperText={errors.dob?.message}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Submit Button */}
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
};

export default AddEmployeeForm;
