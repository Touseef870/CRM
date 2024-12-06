'use client'
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceTable from '@/components/dashboard/invoice/InvoiceTable';
import OrderDetailsDialog from '@/components/dashboard/invoice/OrderDetailsDialog';
import SearchBar from '@/components/dashboard/invoice/SearchBar';
import { AppContext } from '@/contexts/isLogin';
import { Grid, Typography } from '@mui/material';

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

const MainPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [SearchInvoice, setSearchInvoice] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<any>('');
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
          params: {
            skip: page * rowsPerPage,
            limit: rowsPerPage,
            search
          },
        });


        if (Array.isArray(response.data.data.orders)) {
          setOrders(response.data.data.orders);
          setTotalOrders(response.data.data.total);
        } else if (Array.isArray(response.data.data)) {
          setSearchInvoice(response.data.data)
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

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await axios.delete(`https://api-vehware-crm.vercel.app/api/orders/${orderId}`);
      if (response.status === 200) {
        setOrders(orders.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
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
    setPage(0);  // Reset to the first page when rowsPerPage changes
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div>
      <Grid item xs={12} sx={{ padding: '1rem 0' }} >
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>Invoices</Typography>
      </Grid>

      <SearchBar onSearch={handleSearch} />

      <InvoiceTable
        orders={searchQuery ? SearchInvoice : orders}
        onOpenModal={handleOpenModal}
        onDeleteOrder={handleDeleteOrder}
        page={page}
        rowsPerPage={rowsPerPage}
        totalOrders={totalOrders}
        handleChangePage={handleChangePage}        // Pass handleChangePage here
        handleRowsPerPageChange={handleRowsPerPageChange}  // Pass handleRowsPerPageChange here
      />


      {/* <TablePagination
        component="div"
        count={totalOrders}  // This ensures pagination shows the correct total count
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
      /> */}

      <OrderDetailsDialog open={Boolean(selectedOrder)} onClose={handleCloseModal} selectedOrder={selectedOrder} />
    </div>
  );
};

export default MainPage;
