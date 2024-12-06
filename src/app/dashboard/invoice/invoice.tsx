'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, CircularProgress, IconButton, TextField, Pagination } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import axios from 'axios';
import PDFDownloadUI from './PDFDownloadUI';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

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

interface OrderInoviceProps {
  count: number;
  rows: Order[];
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InvoicePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = JSON.parse(localStorage.getItem('AdminloginData') || '{}').token;
  const skip = page * rowsPerPage; // Calculate skip value


  useEffect(() => {
    if (!token) {
      console.log('Token is missing.');
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://api-vehware-crm.vercel.app/api/order/get-orders', {
          params: {
            page: page + 1, // Adjusting for zero-based page index
            limit: rowsPerPage,
            skip: skip,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.data.orders || []);
        setFilteredOrders(response.data.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching orders:', err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, page, rowsPerPage]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredOrders(orders);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = orders.filter(
        (order) =>
          order.title.toLowerCase().includes(lowercasedSearchTerm) ||
          order.description.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredOrders(filtered); // Apply search filter to all orders
    }
  }, [searchTerm, orders]);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `https://api-vehware-crm.vercel.app/api/order/delete-order/${orderId}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
          setFilteredOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

          Swal.fire('Deleted!', 'Your order has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error!', 'There was an issue deleting the order.', 'error');
        }
      }
    });
  };
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rowsPerPage changes
  };

  // Pagination for filtered orders
  const currentPageOrders = filteredOrders.slice(page * rowsPerPage, (page + 1) * rowsPerPage);



  return (
    <Grid container spacing={2} sx={{ padding: '24px' }}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>Invoices</Typography>
      </Grid>

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2, p: 2 }}>
        <TextField
          label="Search Orders"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {loading ? (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
          <CircularProgress size={60} sx={{ color: '#3498DB' }} />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Brand</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Discount Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                    <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#f0f8ff' } }}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <img
                            src={order.brand.img}
                            alt={order.brand.title}
                            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #3498DB' }}
                          />
                          <Typography variant="body2" sx={{ color: '#34495E' }}>
                            {order.brand.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#34495E' }}>{order.title}</TableCell>
                      <TableCell sx={{ fontSize: 14, color: '#7F8C8D' }}>{order.description.split(" ").slice(0, 5).join(" ") + (order.description.split(" ").length > 15 ? "..." : "")}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#E74C3C' }}>{order.discountPrice}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#27AE60' }}>{order.price}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#3498DB' }}>{order.status}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenModal(order)}
                            sx={{
                              padding: 1,
                              borderRadius: '50%',
                              '&:hover': { backgroundColor: '#E3F2FD' },
                            }}
                          >
                            <Visibility sx={{ fontSize: 24 }} />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDeleteOrder(order._id)}
                            sx={{
                              padding: 1,
                              borderRadius: '50%',
                              '&:hover': { backgroundColor: '#FFEBEE' },
                            }}
                          >
                            <Delete sx={{ fontSize: 24 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ padding: '16px', fontWeight: 500, color: '#7F8C8D' }}>
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </Grid>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        sx={{
          borderRadius: 4,
          boxShadow: 24,
          maxHeight: '80vh',
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            fontSize: 24,
            color: '#333',
            textAlign: 'center',
            paddingTop: 3,
            marginBottom: 2,
          }}
        >
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
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    marginTop: '15px',
                  }}
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
        <DialogActions sx={{ padding: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleCloseModal} color="secondary" sx={{ fontWeight: 600 }}>
            Close
          </Button>
          {selectedOrder && <PDFDownloadUI selectedOrder={selectedOrder} />}
        </DialogActions>
      </Dialog>

     <Grid>
     <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
     </Grid>
    </Grid>
    
  );
}

export default InvoicePage;
