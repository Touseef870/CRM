'use client'

import { InvoiceFilter } from '@/components/dashboard/invoice/invoice-filters';
import { Invoice } from '@/components/dashboard/overview/latest-invoice';
import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { useState } from 'react';

function Page() {
    // Original list of invoices
    const UserInvoice = [
        { id: 'ORD-007', customer: { name: 'Ekaterina Tankova' }, amount: 30.5, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-006', customer: { name: 'Cao Yu' }, amount: 25.1, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-004', customer: { name: 'Alexa Richardson' }, amount: 10.99, status: 'refunded', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-003', customer: { name: 'Anje Keizer' }, amount: 96.43, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-002', customer: { name: 'Clarke Gillebert' }, amount: 32.54, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-001', customer: { name: 'Adam Denisov' }, amount: 16.76, status: 'delivered', createdAt: dayjs().subtract(10, 'minutes').toDate() },
        { id: 'ORD-005', customer: { name: 'Adam Denisov' }, amount: 16.76, status: 'pending', createdAt: dayjs().subtract(10, 'minutes').toDate() },
    ];

    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredInvoices = UserInvoice.filter((invoice) => {
        return (
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <Grid lg={8} md={12} xs={12}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Invoice</Typography>
                    {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Import
                        </Button>
                        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                            Export
                        </Button>
                    </Stack> */}
                </Stack>
                <div>
                    <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                        Add
                    </Button>
                </div>
            </Stack>
            <InvoiceFilter onChange={handleSearchChange} />

            <Invoice
                orders={filteredInvoices}
                sx={{ height: '100%' }}
            />
        </Grid>
    );
}

export default Page;
