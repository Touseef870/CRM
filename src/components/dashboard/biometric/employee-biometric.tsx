'use client';

import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

interface EmployeeData {
  userId: string;
  userType: string;
  date: string;
  checkInTime?: string;  // Made optional for better handling
  checkOutTime?: string; // Made optional for better handling
}

interface EmployeeBiometricProps {
  employeeData: EmployeeData[];
}

const EmployeeBiometric: React.FC<EmployeeBiometricProps> = ({ employeeData }) => {
  return (
    <Grid container spacing={3}>
      {/* {employeeData.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }} aria-labelledby={`employee-card-${index}`}>
            <CardContent>
              <Typography variant="h6" id={`employee-card-${index}`}>
                User ID: {item.userId}
              </Typography>
              <Typography>User Type: {item.userType}</Typography>
              <Typography>Date: {item.date}</Typography>
              <Typography>Check-In: {item.checkInTime || "Not Available"}</Typography>
              <Typography>Check-Out: {item.checkOutTime || "Not Available"}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))} */}
    </Grid>
  );
};

export default EmployeeBiometric;
