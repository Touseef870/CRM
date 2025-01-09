import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  totalAmount: number;

  clientId: string;
  brand: {
    title: string;
    description: string;
    image: string;
  };
}

interface ClientOrdersProps {
  clientId: any;
}

const ClientOrders: React.FC<ClientOrdersProps> = ({ clientId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const getData = localStorage.getItem('AdminloginData');
        const token = JSON.parse(getData!).token;

        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/order/client-order/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data.length === 0) {
          setError('No order has been generated for this client.');
        }

        if (Array.isArray(response.data.data)) {
          setOrders(response.data.data);
          console.log(response.data.data);
        } else {
          setError('Received data is not an array');
        }
      } catch (err: any) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [clientId]);

  const handleOpen = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return description;
  };

  if (loading) {
    return <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <CircularProgress />
    </Box>
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: '2rem',
        }}
      >
        <Alert
          severity="error"
          sx={{
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 3,
          boxShadow: 3,
          borderRadius: 2,
          overflowX: 'auto', // Enable horizontal scroll
        }}
      >
        <Table sx={{ minWidth: 1000 }}> {/* Set a minimum width for the table */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f5f5f5',
              }}
            >
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Discount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                  '&:hover': {
                    backgroundColor: '#f0f8ff',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                <TableCell>{`${order._id.substring(0, 10)}...`}</TableCell>
                <TableCell>{order.title}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {truncateDescription(order.description)}
                </TableCell>
                <TableCell>${order.price}</TableCell>
                <TableCell
                  sx={{
                    color: order.discountPrice === 0 ? 'red' : 'green',
                    fontWeight: 'bold',
                  }}
                >
                  ${order.discountPrice === 0 ? '--' : order.discountPrice}
                </TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>{order.brand ? order.brand.title : 'N/A'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton onClick={() => handleOpen(order)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>




           {/* modal  */}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          borderRadius: 2,
          boxShadow: 24,
          padding: { xs: 2, sm: 3 },
          overflow: 'hidden', // Prevents overflow on small screens
        }}
      >
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }, // Adjusted font size for mobile responsiveness
            color: '#2c3e50',
            padding: { xs: 2, sm: 3 },
            borderBottom: '1px solid #ecf0f1',
            backgroundColor: '#ecf0f1',
          }}
        >
          Order Details
        </DialogTitle>

        <DialogContent sx={{ padding: { xs: 2, sm: 3 } }}>
          {selectedOrder && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 3, sm: 4 },
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              {/* Left Side: Brand Details */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '100%', sm: '35%' },
                  padding: { xs: '1rem', sm: '0' },
                  textAlign: 'center',
                  marginBottom: { xs: 3, sm: 0 },
                  marginTop: 4,
                }}
              >
                {/* Brand Image */}
                <Box
                  sx={{
                    width: 130,
                    height: 130,
                    backgroundColor: '#34495e',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    overflow: 'hidden',
                    marginBottom: 2,
                  }}
                >
                  {selectedOrder.brand?.image ? (
                    <Avatar
                      src={selectedOrder.brand.image}
                      alt="Brand Image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      N/A
                    </Typography>
                  )}
                </Box>

                {/* Brand Title */}
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{
                    color: '#34495e',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    textAlign: 'center',
                    marginTop: 0,
                  }}
                >
                  {selectedOrder.brand?.title || 'N/A'}
                </Typography>
              </Box>

              {/* Right Side: Order Details */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  width: { xs: '100%', sm: '85%' },
                }}
              >
                {[{ label: 'Order ID:', value: selectedOrder._id },
                { label: 'Title:', value: selectedOrder.title },
                { label: 'Description:', value: selectedOrder.description },
                { label: 'Price:', value: `$${selectedOrder.price}` },
                {
                  label: 'Discount Price:',
                  value: selectedOrder.discountPrice === 0 ? '--' : `$${selectedOrder.discountPrice}`,
                  color: selectedOrder.discountPrice === 0 ? '#e74c3c' : '#2ecc71',
                },
                { label: 'Total Amount:', value: `$${selectedOrder.totalAmount}` },
                ].map(({ label, value, color }, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 1,
                      paddingTop: 1,
                      borderBottom: '1px solid #ecf0f1',
                      flexWrap: 'wrap', // Allow wrapping on small screens
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{
                        color: '#7f8c8d',
                        fontSize: { xs: '0.9rem', sm: '1rem' }, // Responsive font sizing
                        flex: 1,
                        textAlign: 'left',
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: color || '#34495e',
                        textAlign: 'right',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: '500',
                        flex: 1,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ justifyContent: 'center', padding: { xs: 2, sm: 3 } }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: '600',
              padding: '8px 20px',
              textTransform: 'none',
              borderRadius: 1,
              backgroundColor: '#3498db', // Soft blue
              '&:hover': {
                backgroundColor: '#2980b9', // Slightly darker blue on hover
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>












    </Box>
  );
};

export default ClientOrders;
