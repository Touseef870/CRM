'use client';

import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import CloudinaryUpload from '@/components/cloudinary/cloudinary_upload';
import { AppContext } from '@/contexts/isLogin';



interface AddBrandProps {
    open: boolean;
    handleClose: () => void;
}

export default function AddBrand({ open, handleClose }: AddBrandProps) {
    const { storedValue } = useContext(AppContext)!;
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        imgUrl: null as any,
        description: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);

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

    const handleUploadComplete = (url: string | null) => {
        setUploadedUrl(url);
        setFormData({ ...formData, imgUrl: url });
        console.log("Uploaded Image URL:", url);
    };

    const handleFormSubmit = async () => {
        try {
            const response = await axios.post('https://api-vehware-crm.vercel.app/api/brand/add', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedValue.token}`,
                },
            });
            console.log(response, "response");
            handleClose();
            setFormData({
                title: '',
                imgUrl: null as any,
                description: '',
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Brand</DialogTitle>
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
                    {file && (
                        <CloudinaryUpload file={file} onUploadComplete={handleUploadComplete} />
                    )}
                    <label htmlFor="image-upload">
                        <Button
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            variant="outlined"
                            fullWidth
                            sx={{ textAlign: 'center' }}
                        >
                            {formData.imgUrl ? 'Image Selected' : 'Select Image'}
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
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleFormSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

