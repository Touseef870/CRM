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
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';

export interface Customer {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  salary: string;
  position: string;
  joiningDate: string;
  leavingDate: string;

}

interface CustomersTableProps {
  count: number;
  rows: any;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomersTable({
  count,
  rows,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  onRowsPerPageChange,
}: CustomersTableProps): React.JSX.Element {
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
              <TableCell>Salary</TableCell>
              <TableCell>Position</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <TableRow
                    key={index}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded shadow-md space-x-4 animate-pulse"
                  >
                    <TableCell className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </TableCell>
                    <TableCell className="col-span-1">
                      <div className="w-20 h-4 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="col-span-2">
                      <div className="w-40 h-4 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="col-span-1">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="col-span-1">
                      <div className="w-28 h-4 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="col-span-1">
                      <div className="w-16 h-4 bg-gray-300 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              rows.map((row: any) => (
                <Link
                  href={`/dashboard/employ/${row._id}`}
                  key={row._id}
                  passHref
                  legacyBehavior
                >
                  <TableRow hover key={row._id} sx={{ cursor: "pointer" }}>
                    <TableCell>
                      <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
                        <Avatar src={row.avatar} />
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.country || "Pakistan"}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.salary}</TableCell>
                    <TableCell>{row.position}</TableCell>
                  </TableRow>
                </Link>
              ))
            )}


          </TableBody>


        </Table>
      </Box>
      <Divider />

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
