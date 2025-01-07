'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Skeleton } from '@mui/material';
import { useSelection } from '@/hooks/use-selection';
import Link from 'next/link';

function noop(): void {}

export interface Customer {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  salary: string;
  serviceType: string;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const [loading, setLoading] = React.useState(true); // Define the loading state

  // Simulate loading for demonstration purposes
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false); // After 3 seconds, set loading to false (simulating data fetch)
    }, 3000);
  }, []);

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer._id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Service</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Check if loading is true, if yes, show Skeleton loader */}
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width="100px" />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="150px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="100px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="120px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="120px" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              rows.map((row) => {
                const isSelected = selected?.has(row._id);

                return (
                  <Link href={`/dashboard/clients/${row._id}`} key={row._id} passHref legacyBehavior>
                    <TableRow hover key={row._id} selected={isSelected} sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                          <Avatar src={row.avatar} />
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>Pakistan</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.serviceType}</TableCell>
                    </TableRow>
                  </Link>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
    </Card>
  );
}
