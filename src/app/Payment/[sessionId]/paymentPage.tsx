'use client'
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Box, Button, Card, CardContent, CardMedia, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { AppContext } from "@/contexts/isLogin";

export default function PaymentPage() {
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { sessionId } = useParams<any>();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`https://api-vehware-crm.vercel.app/api/payment/get-payment-details/${sessionId}`);
                setPaymentDetails(response.data.data);
            } catch (error) {
                setSnackbarMessage("Unable to fetch payment details.");
                setOpenSnackbar(true);
            }
        };

        fetchPaymentDetails();
    }, [sessionId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setSnackbarMessage("Stripe has not loaded yet. Please try again.");
            setOpenSnackbar(true);
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            setSnackbarMessage("Please fill out your card details.");
            setOpenSnackbar(true);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(paymentDetails.clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        address: {
                            postal_code: "85400",
                        },
                    },
                },
            });

            if (error) {
                setSnackbarMessage(`Payment Failed: ${error.message}`);
                setOpenSnackbar(true);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                setSnackbarMessage(`Payment for ${paymentDetails.productDetails.product_title} completed successfully!`);
                setOpenSnackbar(true);

                try {
                    await axios.post(`https://api-vehware-crm.vercel.app/api/payment/create-payment/${sessionId}`);
                } catch (error) {
                    console.log("Order status update failed", error);
                }
            }
        } catch (err) {
            setSnackbarMessage("An unexpected error occurred during payment.");
            setOpenSnackbar(true);
        }
    };

    return (
        <Box sx={{ maxWidth: '100%', mx: 'auto', p: 0, display: 'flex', height: '100vh', flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Left Side: Random Wallpaper */}
            <Box sx={{ flex: 1, display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
                <CardMedia
                    component="img"
                    height="100%" // Full height of the container
                    image="https://img.freepik.com/premium-vector/payment-concept-blue-background-invoice-money-bill-discount-icons_159242-6366.jpg" // Wallpaper image
                    alt="Wallpaper"
                    sx={{
                        objectFit: 'cover',
                        width: '100%', // Full width
                        height: '100vh', // Full height
                    }}
                />
            </Box>

            {/* Right Side: Payment Details */}
            <Box sx={{
                flex: 1.5,
                display: 'flex',
                flexDirection: 'column',
                padding: 12,
                borderRadius: '12px',
                height: '100vh', // Ensures full height for the payment section
                overflowY: 'auto', // To avoid overflow if content is too long
                backgroundColor: '#fff',
            }}>
                {paymentDetails ? (
                    <Card sx={{
                        display: 'flex',
                        boxShadow: 10,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        margin: 'auto',
                        width: '100%',
                        backgroundColor: '#fff',
                    }}>
                        {/* Left Side: Product Details */}
                        <Box sx={{
                            flex: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRight: '1px solid #e0e0e0',
                        }}>
                            <CardMedia
                                component="img"
                                height="350"
                                image={paymentDetails.productDetails?.brand_image}
                                alt={paymentDetails.productDetails?.product_title}
                                sx={{
                                    objectFit: 'cover',
                                    borderRadius: '12px 0 0 12px',
                                    backgroundColor: 'black',
                                }}
                            />
                            <CardContent sx={{ padding: '32px', backgroundColor: '#f8f8f8' }}>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{ color: '#333', fontFamily: "'Roboto', sans-serif" }}
                                >
                                    {paymentDetails.productDetails?.product_title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#666' }}>
                                    {paymentDetails.productDetails?.product_description}
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, color: '#333' }}>
                                    ${paymentDetails.amount}
                                </Typography>
                            </CardContent>
                        </Box>

                        {/* Right Side: Payment Form */}
                        <Box sx={{
                            flex: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 8,
                            backgroundColor: '#ffffff',
                            borderRadius: '0 12px 12px 0',
                        }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 6, color: '#333' }}>
                                Payment Information
                            </Typography>

                            <Box component="form" onSubmit={handlePayment} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                        Card Number
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <CardNumberElement />
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                            Expiry Date
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                backgroundColor: '#fafafa',
                                                boxShadow: 1,
                                            }}
                                        >
                                            <CardExpiryElement />
                                        </Box>
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                                            CVC
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                backgroundColor: '#fafafa',
                                                boxShadow: 1,
                                            }}
                                        >
                                            <CardCvcElement />
                                        </Box>
                                    </Box>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        mt: 2,
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        backgroundColor: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        },
                                    }}
                                >
                                    Pay Now
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress color="primary" />
                    </Box>
                )}
            </Box>

      
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
