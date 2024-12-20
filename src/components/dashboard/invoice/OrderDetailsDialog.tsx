import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider, Button, CardMedia, CardContent, Card, Snackbar, Alert } from '@mui/material';
import PDFDownloadUI from '../../../app/dashboard/invoice/PDFDownloadUI';
import { toast } from 'react-toastify';



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
    image: string;
  };
}

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: Order | any;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onClose, selectedOrder }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const payment = () => {
    if (!selectedOrder || !selectedOrder.sessionId) {
      setSnackbarMessage('No valid order to copy the payment link.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const paymentLink = `${window.location.origin}/Payments/${selectedOrder.sessionId}`;

    navigator.clipboard
      .writeText(paymentLink)
      .then(() => {
        setSnackbarMessage('Payment link copied to clipboard!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy payment link:', err);
        setSnackbarMessage('Failed to copy payment link. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };







  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ borderRadius: '50%', boxShadow: 54, maxHeight: '100vh' }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: 30,
          color: '#333',
          textAlign: 'center',
          paddingTop: 3,
          marginBottom: 5,
        }}
      >
        Order Details
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 3 }}>
        {selectedOrder && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  image={selectedOrder.brand.image}
                  alt={selectedOrder.brand.title}
                  sx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2C3E50',
                      marginBottom: 1,
                      textTransform: 'capitalize',
                    }}
                  >
                    Title: {selectedOrder.brand.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 16,
                      color: '#7F8C8D',
                      lineHeight: 1.6,
                    }}
                  >
                    Description: {selectedOrder.brand.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: '#2C3E50' }}
              >
                Order Title:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 16, color: '#34495E' }}
              >
                {selectedOrder.title}
              </Typography>
              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: '#2C3E50' }}
              >
                Description:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, color: '#7F8C8D' }}
              >
                {selectedOrder.description}
              </Typography>
              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: '#2C3E50' }}
              >
                Discount Price:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 16, color: selectedOrder.discountPrice === 0 ? 'red' : 'green' }}
              >
                {selectedOrder.discountPrice !== 0
                  ? selectedOrder.discountPrice
                  : '--'}
              </Typography>
              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: '#2C3E50' }}
              >
                Price:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 16, color: '#27AE60' }}
              >
                {selectedOrder.price !== 0 ? selectedOrder.price : '-'}
              </Typography>
              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: '#2C3E50' }}
              >
                Status:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, color: '#3498DB' }}
              >
                {selectedOrder.status}
              </Typography>
              <Button
                onClick={payment}
                sx={{
                  backgroundColor: '#3498DB',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '8px 8px',
                  my: 3,
                  '&:hover': {
                    backgroundColor: '#85C1E9',
                    color: 'white',
                  },
                }}
              >
                Copy Payment Link
              </Button>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 2, paddingTop: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: '#3498DB',
            color: 'white',
            fontWeight: 'bold',
            padding: '8px 8px',
            '&:hover': {
              backgroundColor: '#85C1E9',
              color: 'white',
            },
          }}
        >
          Close
        </Button>

        {selectedOrder && <PDFDownloadUI selectedOrder={selectedOrder} />}
      </DialogActions>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default OrderDetailsDialog;