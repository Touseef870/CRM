import React, { useState } from 'react';
import axios from 'axios';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Button,
    Stack,
    Typography,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    FormHelperText
} from '@mui/material';
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, X as CloseIcon } from '@phosphor-icons/react';
import { SelectChangeEvent } from '@mui/material/Select';
import Swal from 'sweetalert2';

export function SignInForm(): React.JSX.Element {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        salary: '',
        cnic: '',
        type: 'sub-admin', // Default value
        dob: '',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(true); // Use modal state
    const [errors, setErrors] = useState<any>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const { name, email, password, phone, salary, cnic, type, dob } = formData;
        let newErrors: any = {};

        if (!name) newErrors.name = 'Name is required.';
        if (!email) newErrors.email = 'Email is required.';
        else {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email)) newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) newErrors.password = 'Password is required.';
        else if (password.length < 8) newErrors.password = 'Password should be at least 8 characters long.';
        else if (!/[A-Z]/.test(password)) newErrors.password = 'Password must contain at least one uppercase letter.';
        else if (!/[a-z]/.test(password)) newErrors.password = 'Password must contain at least one lowercase letter.';
        else if (!/\d/.test(password)) newErrors.password = 'Password must contain at least one number.';

        if (!phone) newErrors.phone = 'Phone number is required.';
        else {
            const phonePattern = /^[0-9]{11}$/; // For 11 digits phone number
            if (!phonePattern.test(phone)) newErrors.phone = 'Please enter a valid 11-digit phone number (e.g. 03272748498).';
        }

        if (!salary) newErrors.salary = 'Salary is required.';
        else if (parseInt(salary) <= 0) newErrors.salary = 'Salary should be a positive number.';

        if (!cnic) newErrors.cnic = 'CNIC is required.';
        else if (cnic.length !== 13) newErrors.cnic = 'CNIC should be 13 digits long.';

        if (!dob) newErrors.dob = 'Date of Birth is required.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        return true;
    };

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear any previous error messages
        setErrors({});

        // Validate form data before sending request
        if (!validateForm()) return;

        try {
            const storedData = JSON.parse(localStorage.getItem('AdminloginData') || '{}');
            const token = storedData?.token;

            const dataToSend = { ...formData };
            const response = await axios.post('https://vehware-dashboard.vercel.app/api/auth/signup', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User added successfully!',
                });
                setIsModalOpen(false); // Close modal on success
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'An error occurred during login. Please try again.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error',
                    text: 'An unexpected error occurred. Please try again.',
                });
            }
        }
    };

    return (
        <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="sm"
            fullWidth
            BackdropProps={{
                onClick: (event) => event.stopPropagation() // Prevents backdrop click from closing the dialog
            }}
            sx={{ zIndex: 1301 }} // Ensure the dialog stays above other elements
        >
            {/* Modal close button */}
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add User
                <IconButton onClick={() => setIsModalOpen(false)} sx={{ color: '#555' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <form onSubmit={handleSignIn}>
                    <Stack spacing={3} sx={{ width: '100%', maxWidth: 600, margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
                        {/* Name Input */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Name</InputLabel>
                            <OutlinedInput
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                label="Name"
                                type="text"
                            />
                            {errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                        </FormControl>

                        {/* Email Input */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Email address</InputLabel>
                            <OutlinedInput
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                label="Email address"
                                type="email"
                            />
                            {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                        </FormControl>

                        {/* Password Input */}
<FormControl fullWidth variant="outlined" error={!!errors.password}>
    <InputLabel>Password</InputLabel>
    <OutlinedInput
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        type={showPassword ? 'text' : 'password'}
        label="Password"
        endAdornment={
            <InputAdornment position="end">
                <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                >
                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                </IconButton>
            </InputAdornment>
        }
    />
    {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
</FormControl>


                        {/* Contact Number Input */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Contact</InputLabel>
                            <OutlinedInput
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                label="Contact"
                                type="number"
                                placeholder="+92 *********"
                            />
                            {errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
                        </FormControl>

                        {/* Salary Input */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Salary</InputLabel>
                            <OutlinedInput
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                label="Salary"
                                type="number"
                                placeholder="10000"
                            />
                            {errors.salary && <FormHelperText error>{errors.salary}</FormHelperText>}
                        </FormControl>

                        {/* CNIC Input */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>CNIC</InputLabel>
                            <OutlinedInput
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleInputChange}
                                label="CNIC"
                                type="number"
                                placeholder="*****_*******_*"
                                inputProps={{ minLength: 13, maxLength: 13 }}
                            />
                            {errors.cnic && <FormHelperText error>{errors.cnic}</FormHelperText>}
                        </FormControl>

                        {/* Type Select Dropdown */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="type"
                                value={formData.type}
                                onChange={handleSelectChange}
                                label="Role"
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="sub-admin">Sub-Admin</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Date of Birth Input */}
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Date of Birth</InputLabel>
                            <OutlinedInput
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                label="Date of Birth"
                                type="date"
                            />
                            {errors.dob && <FormHelperText error>{errors.dob}</FormHelperText>}
                        </FormControl>

                        {/* Submit Button */}
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    );
}
