'use client';
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
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            padding: '16px',
            backgroundColor: '#f4f4f4',
        }}
    >
        {/* Left Side: Random Wallpaper */}
        <Box
            sx={{
                width: '100%',
                height: { xs: '200px', sm: '300px', md: '100vh' },
                marginBottom: '20px',
                overflow: 'hidden',
            }}
        >
            <CardMedia
                component="img"
                image="https://img.freepik.com/premium-vector/payment-concept-blue-background-invoice-money-bill-discount-icons_159242-6366.jpg"
                alt="Wallpaper"
                sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                }}
            />
        </Box>
    
        {/* Right Side: Payment Details */}
        <Box
            sx={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                padding: '16px',
                boxShadow: 3,
                borderRadius: '12px',
                marginBottom: '20px',
                alignItems: 'center',
                gap: '16px',
            }}
        >
            {paymentDetails ? (
                <Card
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 3,
                        padding: 3,
                    }}
                >
                    {/* Left Side: Product Details */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={paymentDetails.productDetails?.brand_image}
                            alt={paymentDetails.productDetails?.product_title}
                            sx={{
                                objectFit: 'contain',
                                height: '250px',
                                width: '100%',
                                borderRadius: '8px',
                            }}
                        />
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    color: '#333',
                                    fontSize: '1.2rem',
                                    marginTop: '16px',
                                }}
                            >
                                {paymentDetails.productDetails?.product_title}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    color: '#666',
                                    marginTop: '8px',
                                }}
                            >
                                {paymentDetails.productDetails?.product_description}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#333',
                                    fontWeight: 'bold',
                                    marginTop: '16px',
                                }}
                            >
                                ${paymentDetails.amount}
                            </Typography>
                        </CardContent>
                    </Box>
    
                    {/* Right Side: Payment Form */}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 2,
                            backgroundColor: '#f8f8f8',
                            borderRadius: '8px',
                            marginTop: '20px',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                                textAlign: 'center',
                            }}
                        >
                            Payment Information
                        </Typography>
    
                        <Box
                            component="form"
                            onSubmit={handlePayment}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                width: '100%',
                            }}
                        >
                            {/* Card Number Field */}
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        marginBottom: '8px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                    }}
                                >
                                    Card Number
                                </Typography>
                                <Box
                                    sx={{
                                        padding: '12px',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        backgroundColor: '#fafafa',
                                    }}
                                >
                                    <CardNumberElement />
                                </Box>
                            </Box>
    
                            {/* Expiry Date & CVC Fields */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: '20px',
                                }}
                            >
                                {/* Expiry Date Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            marginBottom: '8px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                        }}
                                    >
                                        Expiry Date
                                    </Typography>
                                    <Box
                                        sx={{
                                            padding: '12px',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                        }}
                                    >
                                        <CardExpiryElement />
                                    </Box>
                                </Box>
    
                                {/* CVC Field */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            marginBottom: '8px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                        }}
                                    >
                                        CVC
                                    </Typography>
                                    <Box
                                        sx={{
                                            padding: '12px',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                        }}
                                    >
                                        <CardCvcElement />
                                    </Box>
                                </Box>
                            </Box>
    
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!stripe}
                                sx={{
                                    marginTop: '20px',
                                    padding: '12px 24px',
                                    backgroundColor: '#4CAF50',
                                    '&:hover': {
                                        backgroundColor: '#45a049',
                                    },
                                }}
                            >
                                {stripe ? 'Pay Now' : 'Loading Stripe...'}
                            </Button>
                        </Box>
                    </Box>
                </Card>
            ) : (
                <CircularProgress />
            )}
        </Box>
    
        {/* Snackbar for error or success messages */}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
        >
            <Alert
                onClose={() => setOpenSnackbar(false)}
                severity="info"
                sx={{ width: '100%' }}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
    </Box>
    
    );
}
