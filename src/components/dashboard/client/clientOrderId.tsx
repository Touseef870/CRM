import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  clientId: string;
  brandId: string;
}

interface ClientOrdersProps {
  clientId: string;
  orderData: {
    brandId: string;
    clientId: string;
    title: string;
    description: string;
    price: string;
  };
}

const ClientOrders: React.FC<ClientOrdersProps> = ({ clientId, orderData }) => {
  const [orders, setOrders] = useState<Order[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const getData = localStorage.getItem("AdminloginData");
        const token = JSON.parse(getData!).token;
  
        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/order/client-order/${clientId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);   

        // Check if the response data is an array before setting it
        if (Array.isArray(response.data)) {
          setOrders(response.data);
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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Brand</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.title}</TableCell>
              <TableCell>{order.description}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>{order.brandId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientOrders;
