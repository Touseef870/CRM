'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

interface EmployeeData {
  employeeName: string;
  managerName: string;
  ratePerHour: string;
  month: string;
  weekData: {
    date: string;
    totalHours: string;
    day: string;
    timeIn1: string;
    timeOut1: string;
    timeIn2: string;
    timeOut2: string;
  }[]; // This is an array of objects representing each week's data
}

interface EmployeeBiometricProps {
  employeeData: EmployeeData | null;
}

const EmployeeBiometric: React.FC<EmployeeBiometricProps> = ({ employeeData }) => {
  if (!employeeData) {
    return <div>Loading...</div>; // Show a loading message if data isn't available yet
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">{employeeData.employeeName}</Typography>
      <Typography variant="h6">Manager: {employeeData.managerName}</Typography>
      <Typography variant="body1">Rate per Hour: {employeeData.ratePerHour}</Typography>
      <Typography variant="body1">Month: {employeeData.month}</Typography>

      {/* Display Weekly Breakdown */}
      {employeeData.weekData.map((week, index) => (
        <div key={index}>
          <Typography variant="h6">{`Week ${index + 1} Breakdown`}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Day</TableCell>
                  <TableCell>Time In 1</TableCell>
                  <TableCell>Time Out 1</TableCell>
                  <TableCell>Time In 2</TableCell>
                  <TableCell>Time Out 2</TableCell>
                  <TableCell>Total Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{week.date}</TableCell>
                  <TableCell>{week.day}</TableCell>
                  <TableCell>{week.timeIn1}</TableCell>
                  <TableCell>{week.timeOut1}</TableCell>
                  <TableCell>{week.timeIn2}</TableCell>
                  <TableCell>{week.timeOut2}</TableCell>
                  <TableCell>{week.totalHours}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </Box>
  );
};

export default EmployeeBiometric;
