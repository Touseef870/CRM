'use client';

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Box, Button, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

// Define the interface for a single formatted row
interface FormattedData {
  userId: string | number; // Assuming userId is either string or number
  userType: string; // Assuming userType is a string
  date: string; // Formatted date string
  checkInTime: number; // Decimal value for check-in time
  checkOutTime: number; // Decimal value for check-out time
}

interface UploadAndDisplayProps {
  onFileUpload: (data: any) => void; // Define the prop to send data back to parent
}

const UploadAndDisplay: React.FC<UploadAndDisplayProps> = ({ onFileUpload }) => {
  const [jsonData, setJsonData] = useState<any[]>([]); // Store parsed data
  const [headers, setHeaders] = useState<string[]>([]); // Store column headers
  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Parse data as 2D array
        const [headerRow, ...rows] = parsedData; // Separate headers from rows

        const validRows = rows.filter((row: any) => {
          const userId = row[0];
          const userType = row[1];
          const checkInTime = row[2];
          const checkOutTime = row[3];
          const date = row[4];

          return userId && userType && !isNaN(checkInTime) && !isNaN(checkOutTime) && formatExcelDate(date) !== "Invalid Date";
        });

        setHeaders(headerRow as string[]); 
        setJsonData(validRows); 

        onFileUpload(validRows);
      };
      reader.readAsBinaryString(file);
    }
  };

  const formatExcelDate = (serial: number): string => {
    if (isNaN(serial) || serial <= 0) {
      return "Invalid Date"; 
    }

    const date = new Date((serial - 25569) * 86400 * 1000);

   
    if (isNaN(date.getTime())) {
      return "Invalid Date"; 
    }

    return date.toISOString().split('T')[0]; 
  };

  const formatTime = (decimal: number): string => {
    if (isNaN(decimal) || decimal < 0) {
      // Return a default value or handle invalid data
      return "Invalid Time";
    }

    const totalMinutes = decimal * 1440; // 1440 minutes in a day
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleSendData = async () => {
    const formattedData: FormattedData[] = jsonData.map((row) => {
      const checkInDecimal = row[2];
      const checkOutDecimal = row[3];

      const checkInTime = checkInDecimal;
      const checkOutTime = checkOutDecimal;

      return {
        userId: row[0],
        userType: row[1],
        date: formatExcelDate(row[4]),
        checkInTime,
        checkOutTime,
      };
    }).filter(item => item.date !== "Invalid Date"); // Filter out invalid rows

    const dataToSend = {
      date: formattedData[0]?.date, // Ensure this doesn't break if formattedData is empty
      dailyRecords: formattedData.map((item) => {
        const { date, ...rest } = item;
        return rest;
      }),
    };

    if (formattedData.length === 0) {
      Swal.fire("Error", "No valid data to send.", "error");
      return;
    }

    try {
      const response = await axios.post(
        "https://api-vehware-crm.vercel.app/api/attendance/add",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { unsaved, saved } = response.data.data;
      const successfulUsers = saved.map((success: any) => `User ID: ${success.userId}`);
      const failedUsers = unsaved.map((error: any) =>
        `User ID: ${error.userId} - Reason: ${error.reason || "Employee not found"}`
      );

      let alertMessage = "";

      if (successfulUsers.length > 0) {
        alertMessage += `✅ **Attendance Added**\n${successfulUsers.join("\n")}\n\n`;
      }

      if (failedUsers.length > 0) {
        alertMessage += `❌ **Failed to Add Attendance**\n${failedUsers.join("\n")}\n\n`;
        alertMessage += `➡️ **Action Required**: Please add missing employees to the database and try again.`;
      }

      Swal.fire({
        title: successfulUsers.length > 0 ? "Partial Success" : "Error",
        html: `<pre>${alertMessage}</pre>`,
        icon: successfulUsers.length > 0 ? "warning" : "error",
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.fire("Error", "Failed to send data. Please try again.", "error");
    }
  };
  

  return (
    <Box sx={{ p: 3, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Upload Excel File
      </Typography>
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload File
        <input
          type="file"
          accept=".xlsx, .xls"
          hidden
          onChange={handleFileUpload}
        />
      </Button>

      {jsonData.length > 0 && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendData}
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            Send Data
          </Button>

          <Grid container spacing={3}>
            {jsonData.map((row, rowIndex) => (
              <Grid item xs={12} sm={6} md={4} key={rowIndex}>
                <Card>
                  <CardContent>
                    {headers.map((header, colIndex) => (
                      <Typography key={colIndex}>
                        <strong>{header}:</strong>{" "}
                        {header === "Date"
                          ? formatExcelDate(row[colIndex])
                          : header === "Check In Time" ||
                            header === "Check Out Time"
                          ? formatTime(row[colIndex])
                          : row[colIndex] || "N/A"}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default UploadAndDisplay;
