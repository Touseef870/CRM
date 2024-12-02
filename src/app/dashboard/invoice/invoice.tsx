'use client'

import { InvoiceFilter } from '@/components/dashboard/invoice/invoice-filters';
import { Invoice } from '@/components/dashboard/overview/latest-invoice';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

function InvoicePage() {
    // Original list of invoices
    const UserInvoice = [
        { id: 'ORD-007', customer: { name: 'Ekaterina Tankova' }, amount: 30.5, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-006', customer: { name: 'Cao Yu' }, amount: 25.1, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-004', customer: { name: 'Alexa Richardson' }, amount: 10.99, status: 'refunded', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-003', customer: { name: 'Anje Keizer' }, amount: 96.43, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-002', customer: { name: 'Clarke Gillebert' }, amount: 32.54, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-001', customer: { name: 'Adam Denisov' }, amount: 16.76, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-005', customer: { name: 'Adam Denisov' }, amount: 16.76, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
    ];

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        image: null as any, // Set image field type to 'any'
        description: '',
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredInvoices = UserInvoice.filter((invoice) => {
        return (
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, image: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = () => {
        console.log(formData); // Log the form data to the console
        handleCloseModal(); // Close the modal after submission
    };

    return (
        <Grid lg={8} md={12} xs={12}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Invoice</Typography>
                </Stack>
                <div>
                    <Button
                        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                        variant="contained"
                        onClick={handleOpenModal} // Open modal on click
                    >
                        Add
                    </Button>
                </div>
            </Stack>
            <InvoiceFilter onChange={handleSearchChange} />

            <Invoice orders={filteredInvoices} sx={{ height: '100%' }} />

            {/* Modal for adding new invoice */}
            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Add Invoice</DialogTitle>
                <DialogContent>
                    <TextField
                        name="title"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData.title}
                        onChange={handleFormChange}
                    />
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="image-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="image-upload">
                            <Button
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                variant="outlined"
                                fullWidth
                                sx={{ textAlign: 'center' }}
                            >
                                {formData.image ? 'Image Selected' : 'Select Image'}
                            </Button>
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: '16px' }} />}
                    </div>
                    <TextField
                        name="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default InvoicePage;
