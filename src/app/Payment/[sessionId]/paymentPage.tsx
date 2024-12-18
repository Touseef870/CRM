'use client'
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Box, Button, Card, CardContent, CardMedia, TextField, Typography, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AnyLayer } from "mapbox-gl";
import { AppContext } from "@/contexts/isLogin";

export default function PaymentPage() {
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const { storedValue } = useContext(AppContext)!;
    const { sessionId } = useParams<any>();
    const stripe = useStripe();
    const elements = useElements();


    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/payment/get-payment-details/${sessionId}`);
                
                setPaymentDetails(response.data.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch payment details.',
                });
            }
        };

        fetchPaymentDetails();
    }, [sessionId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            Swal.fire({
                icon: 'error',
                title: 'Stripe Error',
                text: 'Stripe has not loaded yet. Please try again.',
            });
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill out your card details.',
            });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: error.message,
                });
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: `Payment for ${paymentDetails.productDetails.product_title} completed!`,
                });

                try {
                    const res = await axios.post(`http://localhost:4000/api/payment/create-payment/${sessionId}`);

                    // Swal.fire({
                    //     icon: 'success',
                    //     title: 'Order Updated',
                    //     text: 'Order status has been successfully updated!',
                    // });
                    console.log('Order status has been successfully updated!')
                } catch (error : any) {
                    console.log(error, "status update api error")
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'Order Update Failed',
                    //     text: 'The payment was successful, but the order status could not be updated.',
                    // });
                }
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Payment Error',
                text: 'An unexpected error occurred during payment.',
            });
        }
    };

    console.log(paymentDetails, "payment")

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            {paymentDetails ? (
                <Card sx={{ boxShadow: 3 }}>
                    {/* Product Details */}
                    <CardMedia
                        component="img"
                        height="200"
                        image={paymentDetails.productDetails?.brand_image}
                        alt={paymentDetails.productDetails?.product_title}
                        sx={{ borderRadius: '4px 4px 0 0' }}
                    />
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {paymentDetails.productDetails?.product_title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {paymentDetails.productDetails?.product_description}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                            ${paymentDetails.amount}
                        </Typography>
                    </CardContent>

                    {/* Payment Form */}
                    <Box component="form" onSubmit={handlePayment} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                Card Number
                            </Typography>
                            <Box
                                sx={{
                                    p: 1.5,
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <CardNumberElement />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="body1" gutterBottom>
                                Expiry Date
                            </Typography>
                            <Box
                                sx={{
                                    p: 1.5,
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <CardExpiryElement />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="body1" gutterBottom>
                                CVC
                            </Typography>
                            <Box
                                sx={{
                                    p: 1.5,
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <CardCvcElement />
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ py: 1.5, mt: 1 }}
                        >
                            Pay Now
                        </Button>
                    </Box>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
}
