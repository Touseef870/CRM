'use client';

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress} from '@mui/material';
import { Box } from '@mui/system';
import { CustomersFilters } from '@/components/dashboard/employ/employ-filters';
import { CustomersTable } from '@/components/dashboard/employ/employ-table';
import type { Customer } from '@/components/dashboard/employ/employ-table';
import { AppContext } from '@/contexts/isLogin';
import UploadAndDisplay from '@/components/dashboard/biometric/EmployeeBiometricUpload';
import EmployeeExcel from '@/components/dashboard/employ/EmployeeExcel';

export default function Employee(): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [employ, setEmploy] = useState<Customer[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { storedValue } = useContext(AppContext)!;

  useEffect(() => {
    async function fetchPaginatedCustomers() {
      try {
        setLoading(true);
        setError(null);

        const skip = page * rowsPerPage;
        const limit = rowsPerPage;

        const response = await axios.get('https://api-vehware-crm.vercel.app/api/credentials/employees', {
          params: { skip, limit },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedValue.token}`,
          },
        });

        setEmploy(response.data.data.employees); 
        setTotalEmployees(response.data.data.total); 
      } catch (err) {
        setError('Failed to fetch employees.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPaginatedCustomers();
  }, [page, rowsPerPage, storedValue.token]); 

  const handleFilterEmploy = (value: string) => {
    const filtered = value.trim() === ''
      ? employ
      : employ.filter((customer) =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
    setEmploy(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

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

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Employee List</Typography>
          <EmployeeExcel />
        </Stack>
      </Stack>

      <CustomersFilters
        onChange={(e) => {
          handleFilterEmploy(e.target.value);
        }}
      />

      <CustomersTable
        count={totalEmployees}
        page={page}
        rows={employ} 
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
}
