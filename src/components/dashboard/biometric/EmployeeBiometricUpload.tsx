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
  let token = JSON.parse(getData!).token;

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

        setHeaders(headerRow as string[]); // Save headers
        setJsonData(rows); // Save rows

        // Send the parsed data back to the parent component
        onFileUpload(rows);
      };
      reader.readAsBinaryString(file);
    }
  };

  const formatExcelDate = (serial: number) => {
    const date = new Date((serial - 25569) * 86400 * 1000); // Converts Excel serial date to JavaScript Date
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  };

  const formatTime = (decimal: number) => {
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
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
      };
    });

    const dataToSend = {
      date: formattedData[0].date,
      dailyRecords: formattedData.map((item) => {
        const { date, ...rest } = item;
        return rest;
      }),
    };

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

      // Extract response data
      const { unsaved, totalFailed } = response.data.data;

      if (totalFailed > 0) {
        // Concatenate all error messages into a single string
        const errorMessages = unsaved
          .map(
            (error: any) =>
              `Failed to save attendance for userId ${error.userId}. Reason: ${error.reason}`
          )
          .join("\n"); // Join all error messages into one string separated by newlines

        // Display all errors in one Swal pop-up
        Swal.fire({
          title: "Error",
          text: errorMessages,
          icon: "error",
          showConfirmButton: true,
        });
      } else {
        // All data is saved successfully
        console.log("Data sent successfully:", response.data.data);
        Swal.fire("Success", "All data sent successfully!", "success");
      }
    } catch (error) {
      console.error("Error sending data:", error);

      // Display generic error message
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
