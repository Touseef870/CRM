'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CircularProgress, TablePagination } from '@mui/material';
import { Box } from '@mui/system';
import { CustomersFilters } from '@/components/dashboard/employ/employ-filters';
import { CustomersTable } from '@/components/dashboard/employ/employ-table';
import type { Customer } from '@/components/dashboard/employ/employ-table';

export default function Employee(): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [employ, setEmploy] = useState<Customer[]>([]); // Start with an empty list
  const [filteredEmploy, setFilteredEmploy] = useState<Customer[]>([]); // For filtered list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from API
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);
        const adminLoginData: string | null = localStorage.getItem('AdminloginData');
        const response = await axios.get("https://api-vehware-crm.vercel.app/api/credentials/employees", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(adminLoginData!).token}`,
          },
        });
        setEmploy(response.data.data.employees);
        setFilteredEmploy(response.data.data.employees); // Initialize filtered list
      } catch (err) {
        setError('Failed to fetch employees.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  // Filter employees based on search input
  const handleFilterEmploy = (value: string) => {
    const filtered = value.trim() === ""
      ? employ // If search value is empty, show all employees
      : employ.filter((customer) =>
          customer.name.toLowerCase().includes(value.toLowerCase())
        );
    setFilteredEmploy(filtered); // Update filtered list
    setPage(0); // Reset pagination to the first page
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset pagination when rows per page changes
  };

  // Paginate the filtered list of employees
  const paginatedEmployees = filteredEmploy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Show loading spinner when data is being fetched
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show error message if data fetching fails
  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Employee List</Typography>
        </Stack>
      </Stack>

      {/* Search filter */}
      <CustomersFilters onChange={(e) => handleFilterEmploy(e.target.value)} />

      {/* Employee table */}
      <CustomersTable
        count={filteredEmploy.length}
        page={page}
        rows={paginatedEmployees}
        rowsPerPage={rowsPerPage}
      />

      {/* Pagination controls */}
      <TablePagination
        component="div"
        count={filteredEmploy.length} // Total count of filtered employees
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );
}
