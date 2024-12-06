import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider, Button } from '@mui/material';
import PDFDownloadUI from '../../../app/dashboard/invoice/PDFDownloadUI';

interface Order {
    _id: string;
    title: string;
    description: string;
    discountPrice: number;
    price: number;
    status: string;
    brand: {
        _id: string;
        title: string;
        description: string;
        img: string;
    };
}

interface OrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    selectedOrder: Order | null;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onClose, selectedOrder }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 4, boxShadow: 24, maxHeight: '80vh' }}>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: 24, color: '#333', textAlign: 'center', paddingTop: 3, marginBottom: 2 }}>
                Order Details
            </DialogTitle>
            <DialogContent sx={{ paddingTop: 3 }}>
                {selectedOrder && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50', marginBottom: 1 }}>
                                Title: {selectedOrder.brand.title}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: 14, color: '#7F8C8D', marginBottom: 2 }}>
                                Description: {selectedOrder.brand.description}
                            </Typography>
                            <img
                                src={selectedOrder.brand.img}
                                alt={selectedOrder.brand.title}
                                style={{ width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', marginTop: '15px' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>Order Title:</Typography>
                            <Typography variant="body1" sx={{ fontSize: 16, color: '#34495E' }}>
                                {selectedOrder.title}
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

                            <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>Description:</Typography>
                            <Typography variant="body1" sx={{ fontSize: 14, color: '#7F8C8D' }}>
                                {selectedOrder.description}
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

                            <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>Discount Price:</Typography>
                            <Typography variant="body1" sx={{ fontSize: 16, color: '#E74C3C' }}>
                                {selectedOrder.discountPrice}
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

                            <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>Price:</Typography>
                            <Typography variant="body1" sx={{ fontSize: 16, color: '#27AE60' }}>
                                {selectedOrder.price}
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

                            <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>Status:</Typography>
                            <Typography variant="body1" sx={{ fontSize: 14, color: '#3498DB' }}>
                                {selectedOrder.status}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions sx={{ paddingBottom: 3, paddingTop: 2 }}>
                <Button onClick={onClose} sx={{ backgroundColor: '#3498DB', color: 'white', fontWeight: 'bold' }}>
                    Close
                </Button>
                {selectedOrder && <PDFDownloadUI selectedOrder={selectedOrder} />}
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;
