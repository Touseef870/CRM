'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

export default function PaymentPage() {
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { sessionId } = useParams<any>();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api-vehware-crm.vercel.app/api/payment/get-payment-details/${sessionId}`
                );
                setPaymentDetails(response.data.data);
            } catch (error) {
                setSnackbarMessage('Unable to fetch payment details.');
                setOpenSnackbar(true);
            }
        };

        fetchPaymentDetails();
    }, [sessionId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setSnackbarMessage('Stripe has not loaded yet. Please try again.');
            setOpenSnackbar(true);
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            setSnackbarMessage('Please fill out your card details.');
            setOpenSnackbar(true);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(paymentDetails.clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        address: {
                            postal_code: '85400',
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
                    console.log('Order status update failed', error);
                }
            }
        } catch (err) {
            setSnackbarMessage('An unexpected error occurred during payment.');
            setOpenSnackbar(true);
        }
    };

    return (

    
<div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 justify-center items-center">

<div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl w-full max-w-screen-xl p-4 sm:p-6 space-y-8 md:space-y-0 md:space-x-8 lg:w-11/12 xl:w-11/12">

  {/* Left Side: Payment Form */}
  <div className="flex-1 bg-gray-50 rounded-lg p-4 sm:p-6 space-y-6 shadow-xl">
    <h4 className="text-xl sm:text-2xl font-semibold text-gray-800">Complete Your Payment</h4>
    <p className="text-gray-600 text-sm sm:text-base">Enter your card details to proceed with the payment for the product.</p>

    <form onSubmit={handlePayment} className="space-y-4">
      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-700">Card Number</label>
        <div className="p-4 border-2 border-gray-300 rounded-lg bg-white shadow-md focus-within:border-blue-500">
          <CardNumberElement />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label className="block text-sm sm:text-base font-semibold text-gray-700">Expiry Date</label>
          <div className="p-4 border-2 border-gray-300 rounded-lg bg-white shadow-md focus-within:border-blue-500">
            <CardExpiryElement />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm sm:text-base font-semibold text-gray-700">CVC</label>
          <div className="p-4 border-2 border-gray-300 rounded-lg bg-white shadow-md focus-within:border-blue-500">
            <CardCvcElement />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        Pay Now
      </button>
    </form>

    <div className="space-y-4 mt-8 p-4 border-t-2 border-gray-300">
      <h5 className="text-xl sm:text-2xl font-semibold text-gray-800">Order Summary</h5>
      <div className="flex justify-between">
        <span className="text-gray-600">Total Price:</span>
        <span className="font-bold text-lg text-blue-600">${paymentDetails.amount}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping:</span>
        <span className="font-semibold text-gray-600">Free</span>
      </div>
      <img
        src="https://cdn.shopify.com/s/files/1/2005/6615/files/Webp.net-resizeimage_large.png?v=1501670750"
        alt="Visa"
        className="w-full h-16 sm:h-24 object-contain mt-4"
      />
    </div>
  </div>

  {/* Right Side: Product Information & Details */}
  <div className="flex-1 space-y-6 flex flex-col justify-between bg-[#0e1e99] rounded-lg p-4 sm:p-6 shadow-xl">
    <div className="space-y-6">
      <img
        src={paymentDetails.productDetails?.brand_image}
        alt={paymentDetails.productDetails?.product_title}
        className="h-[200px] sm:h-[250px] w-full object-cover rounded-lg shadow-lg"
      />
      <div className="space-y-3">
        <h3 className="text-2xl sm:text-3xl font-semibold text-white">{paymentDetails.productDetails?.product_title}</h3>
        <p className="text-gray-300">{paymentDetails.productDetails?.product_description}</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl text-white">Taxes and discounts applied</h1>
          <h4 className="text-xl sm:text-2xl font-bold text-white">${paymentDetails.amount}</h4>
        </div>
      </div>
    </div>
  </div>

</div>

{/* Snackbar for Error */}
<Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>

</div>










    );
}
