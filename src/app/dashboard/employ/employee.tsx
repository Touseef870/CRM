'use client'

import React, {useState, useEffect} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { CustomersFilters } from '@/components/dashboard/employ/employ-filters';
import { CustomersTable } from '@/components/dashboard/employ/employ-table';
import type { Customer } from '@/components/dashboard/employ/employ-table';
import { TablePagination } from '@mui/material';

const customers = [
    {
        id: 'USR-010',
        name: 'Alcides Antonio',
        avatar: '/assets/avatar-10.png',
        email: 'alcides.antonio@devias.io',
        phone: '908-691-3242',
        address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-009',
        name: 'Marcus Finn',
        avatar: '/assets/avatar-9.png',
        email: 'marcus.finn@devias.io',
        phone: '415-907-2647',
        address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-008',
        name: 'Jie Yan',
        avatar: '/assets/avatar-8.png',
        email: 'jie.yan.song@devias.io',
        phone: '770-635-2682',
        address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-007',
        name: 'Nasimiyu Danai',
        avatar: '/assets/avatar-7.png',
        email: 'nasimiyu.danai@devias.io',
        phone: '801-301-7894',
        address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },

] satisfies Customer[];

export default function Employee(): React.JSX.Element {
    const [page, setPage] = useState(0);
    let count = customers.length
    const [rowsPerPage, setRowsPerPage] = useState(count);
    const [employ, setEmploy] = useState(customers); // Initial list of customers (unfiltered)

    const handleFilterEmploy = (value: string) => {
        const filtered = value.trim() === ""
            ? customers
            : customers.filter((customer) =>
                customer.name.toLowerCase().includes(value.toLowerCase())
            );
        setEmploy(filtered);
        setPage(0); // Reset to first page after filtering
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page change
    };

    const paginatedEmployees = employ.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);




    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Employ</Typography>
                </Stack>
            </Stack>
            <CustomersFilters onChange={(e) => handleFilterEmploy(e.target.value)} />
            <CustomersTable
                count={employ.length}
                page={page}
                rows={paginatedEmployees} // Only show paginated results
                rowsPerPage={rowsPerPage}
            />

            <TablePagination
                component="div"
                count={employ.length} // Total number of items in filtered list
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Stack>
    );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
