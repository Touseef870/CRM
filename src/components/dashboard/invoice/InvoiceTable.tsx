'use client'

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Typography, CircularProgress, TablePagination } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';

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

interface InvoiceTableProps {
    orders: Order[];
    onOpenModal: (order: Order) => void;
    onDeleteOrder: (orderId: string) => void;
    page: number;
    rowsPerPage: number;
    totalOrders: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


const InvoiceTable: React.FC<InvoiceTableProps> = ({ orders, onOpenModal, onDeleteOrder, page, rowsPerPage, totalOrders, handleChangePage, handleRowsPerPageChange }) => {
    const [notFound, setNotFound] = useState<any>(true)



    const rowsToRender = Array.isArray(orders) ? orders : [];
    useEffect(() => {
        if (rowsToRender.length === 0) {
            setNotFound(true);
            setTimeout(() => {
                setNotFound(false);
            }, 2500);
        } else {
            setTimeout(() => {
                setNotFound(false);
            }, 3000);
        }
    }, [rowsToRender]);

    if (!orders || orders.length === 0) {
        return (
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginTop: '1rem' }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ padding: '16px', fontWeight: 500, color: '#7F8C8D' }}>
                                {notFound ? <CircularProgress size={60} /> : <div> <h1>Invoice Not Found..</h1> <img src='/not-found.png' height={400} width={400} /> </div>}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }


    return (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginTop: '1rem' }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Brand</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Discount </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsToRender.length > 0 ? (
                        rowsToRender.map((order) => (
                            <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#f0f8ff' } }}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <img
                                            src={order.brand.image}
                                            alt={order.brand.title}
                                            style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid #3498DB' }}
                                        />
                                        <Typography variant="body2" sx={{ color: '#34495E' }}>
                                            {order.brand.title}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#34495E' }}>{order.title}</TableCell>
                                <TableCell sx={{ fontSize: 14, color: '#7F8C8D' }}>
                                    {order.description.split(' ').slice(0, 5).join(' ') +
                                        (order.description.split(' ').length > 5 ? '...' : '')}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#E74C3C', textAlign: 'center'  }}>{order.discountPrice === 0 ? '-' : order.discountPrice}</TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#27AE60' }}>{order.price}</TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#3498DB' }}>{order.status}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onOpenModal(order)}
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
                                            onClick={() => onDeleteOrder(order._id)}
                                            sx={{
                                                padding: 1,
                                                borderRadius: '50%',
                                                '&:hover': { backgroundColor: '#FFEBEE' },
                                            }}
                                        >
                                          <Delete sx={{ fontSize: 24, color: '#8B0000' }} />

                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>


                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ padding: '16px', fontWeight: 500, color: '#7F8C8D' }}>
                                {notFound ? <CircularProgress size={60} /> : <div> <h1>Invoice Not Found..</h1> <img src='/not-found.png' height={400} width={400} /> </div>}
                            </TableCell>
                        </TableRow>
                    )}


                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalOrders}  // This ensures pagination shows the correct total count
                page={page}
                onPageChange={handleChangePage}  // Use the received handler
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}  // Use the received handler
                rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
            />

        </TableContainer>
    );
};

export default InvoiceTable;
