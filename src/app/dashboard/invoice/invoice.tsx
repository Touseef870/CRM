'use client'
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceTable from '@/components/dashboard/invoice/InvoiceTable';
import OrderDetailsDialog from '@/components/dashboard/invoice/OrderDetailsDialog';
import SearchBar from '@/components/dashboard/invoice/SearchBar';
import { AppContext } from '@/contexts/isLogin';
import { Grid, Typography } from '@mui/material';
import Swal from 'sweetalert2';

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

const MainPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);  // Default to an empty array
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchInvoice, setSearchInvoice] = useState<Order[]>([]);  // Renamed for consistency
  const [searchQuery, setSearchQuery] = useState<string>('');  // Specify type as string
  const [page, setPage] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const { storedValue } = useContext(AppContext)!;
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchOrders = async (search: string = '') => {
      try {
        const response = await axios.get('https://api-vehware-crm.vercel.app/api/order/get-orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedValue.token}`,
          },
        });

        if (Array.isArray(response.data.data.orders)) {
          setOrders(response.data.data.orders);
          setTotalOrders(response.data.data.total);
        } else if (Array.isArray(response.data.data)) {
          setSearchInvoice(response.data.data);
        } else {
          console.error('Fetched data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders(searchQuery);
  }, [page, rowsPerPage, storedValue.token, searchQuery]);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
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
          const response = await axios.patch(
            `https://api-vehware-crm.vercel.app/api/order/delete-order/${orderId}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedValue.token}`,
              },
            }
          );

          if (response.status === 200) {
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            setSearchInvoice((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            Swal.fire('Deleted!', 'Your order has been deleted.', 'success');
          } else {
            Swal.fire('Error!', 'There was an issue deleting the order.', 'error');
          }
        } catch (error) {
          console.error('Error deleting order:', error);
          Swal.fire('Error!', 'There was an issue deleting the order.', 'error');
        }
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Filter orders based on search query (searching by title)
  const filteredOrders = orders.filter(
    (order) =>
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <div>
      <Grid item xs={12} sx={{ padding: '1rem 0' }} >
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>Invoices</Typography>
      </Grid>

      <SearchBar onSearch={handleSearch} />

      <InvoiceTable
        orders={filteredOrders}
        onOpenModal={handleOpenModal}
        onDeleteOrder={handleDeleteOrder}
        page={page}
        rowsPerPage={rowsPerPage}
        totalOrders={totalOrders}
        handleChangePage={handleChangePage}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />

      {selectedOrder && (
        <OrderDetailsDialog open={Boolean(selectedOrder)} onClose={handleCloseModal} selectedOrder={selectedOrder} />
      )}
    </div>
  );
};

export default MainPage;
