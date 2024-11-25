'use client'


// components/AttendanceTable.tsx
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useParams } from "next/navigation";
import axios from "axios";


// Define the type for each row of attendance data
interface AttendanceRow {
  date: string;
  checkIn: string;
  checkOut: string;
  present: string; // "Yes" or "No"
}

// Define the props type for the component
interface AttendanceTableProps {
  attendanceData: AttendanceRow[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = async ({ attendanceData }) => {

    const { id } = useParams<{ id: string }>();
    console.log(id);



    useEffect(() => {
       try{
            

            const response = async () =>{
                await axios.get(
                     `https://api-vehware-crm.vercel.app/api/attendance/get/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            
                        },
                    }
                ).then((res) => {
                    console.log(res);
                  } )
            }

          response()
        }catch(err){
            console.log(err);
        }
       
      }, []);



  return (
    <Box sx={{ margin: "20px" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        Employee Attendance
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Check-In</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Check-Out</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Present</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "grey.100" },
                  "&:nth-of-type(even)": { bgcolor: "grey.50" },
                  "&:hover": { bgcolor: "primary.light", cursor: "pointer" },
                }}
              >
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.checkIn}</TableCell>
                <TableCell>{row.checkOut}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: row.present === "Yes" ? "green" : "red",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {row.present}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable;
