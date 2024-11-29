'use client';

import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
} from "@mui/material";
import { useParams } from "next/navigation";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2"; // Import SweetAlert

interface AttendanceRow {
  date: string; // ISO format date
  checkInTime: string; // ISO format datetime
  checkOutTime: string; // ISO format datetime
  present: string; // "Yes" or "No"
  _id: string;
}

const AttendanceTable: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<AttendanceRow | null>(null); // Row being edited
  const [editedCheckIn, setEditedCheckIn] = useState<string>(""); // Check-in time in modal
  const [editedCheckOut, setEditedCheckOut] = useState<string>(""); // Check-out time in modal

  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;

  useEffect(() => {
    if (id) {
      const fetchAttendanceData = async () => {
        try {
          const response = await axios.get(
            `https://api-vehware-crm.vercel.app/api/attendance/get/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setAttendanceData(response.data.data.attendance || []);
        } catch (err) {
          console.error("Error fetching attendance data:", err);
        } finally {
          setLoading(false); // Stop loading after the request is done
        }
      };
  
      fetchAttendanceData();
    } else {
      console.error("No ID provided");
    }
  }, [id, token]);
    
  const handleEdit = (row: AttendanceRow) => {
    setEditingRow(row); // Set row to edit
    setEditedCheckIn(moment(row.checkInTime).format("HH:mm")); // Populate modal fields
    setEditedCheckOut(moment(row.checkOutTime).format("HH:mm"));
    setOpenModal(true); // Open the modal
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      // Convert date to ISO format (YYYY-MM-DD)
      const formattedDate = moment(editingRow.date, "DD-MM-YYYY").format("YYYY-MM-DD");

      // Convert check-in and check-out times to ISO format
      const formattedCheckIn = moment(editedCheckIn, "hh:mm A").format("HH:mm");
      const formattedCheckOut = moment(editedCheckOut, "hh:mm A").format("HH:mm");

      // API Call
      await axios.patch(
        `https://api-vehware-crm.vercel.app/api/attendance/update`,
        {
          date: formattedDate,
          checkInTime: formattedCheckIn,
          checkOutTime: formattedCheckOut,
          userId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state locally
      setAttendanceData((prev) =>
        prev.map((row) =>
          row._id === editingRow._id
            ? {
              ...row,
              checkInTime: moment(formattedCheckIn, "HH:mm").format("hh:mm A"), // Display in 12-hour format
              checkOutTime: moment(formattedCheckOut, "HH:mm").format("hh:mm A"),
            }
            : row
        )
      );

      // Close modal and clear editing row
      setOpenModal(false);
      setEditingRow(null);

      Swal.fire({
        icon: 'success',
        title: 'Attendance Edited Successfully!',
        text: 'The attendance has been successfully updated.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'swal2-popup',
        },
        didOpen: () => {
          // Set the z-index for the success popup
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = '9999'; // Set z-index to bring it to the front
          }
        },
      });

      // Close the modal on success
      setOpenModal(false);

    } catch (err) {
      console.error("Error saving updated attendance data:", err);
      // Show error alert in case of failure
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update attendance. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal2-popup', // Same class as success alert to apply z-index changes
        },
        didOpen: () => {
          // Set the z-index for the error popup
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = '9999'; // Ensure error popup is also on top
          }
        },
      });

      // Close the modal on error
      setOpenModal(false);

    }
  };
  const formattedAttendanceData = attendanceData.map((row) => ({
    ...row,
    date: moment(row.date).format("DD-MM-YYYY"), // ISO date to DD-MM-YYYY
    checkInTime: row.checkInTime
      ? moment(row.checkInTime, "HH:mm").format("hh:mm A")
      : "N/A", // Handle empty time
    checkOutTime: row.checkOutTime
      ? moment(row.checkOutTime, "HH:mm").format("hh:mm A")
      : "N/A",
  }));


  return (
    <Box sx={{ margin: "20px" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Employee Attendance
      </Typography>

      {/* Show loading spinner while fetching data */}
      {loading ? (
        <Box sx={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "primary.main", color: "white" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                  Check-In
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                  Check-Out
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0 ? (
                formattedAttendanceData.map((data) => (
                  <TableRow
                    key={data._id}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "grey.100" },
                      "&:nth-of-type(even)": { bgcolor: "grey.50" },
                      "&:hover": {
                        bgcolor: "primary.light",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      },
                      "& td": {
                        fontSize: 14,
                        padding: "16px 24px",
                      },
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>{data.date}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{data.checkInTime}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{data.checkOutTime}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => { handleEdit(data); }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{
                      textAlign: "center",
                      fontSize: 16,
                      padding: "20px",
                    }}
                  >
                    No attendance data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Editing Attendance */}
      <Dialog
        open={openModal}
        onClose={() => { setOpenModal(false); }}
        fullWidth
        maxWidth="sm" // Adjust modal size
        sx={{
          zIndex: 13010, // Custom z-index for MUI dialog (MUI modal default z-index is 1300)
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Edit Attendance
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Check-In Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={moment(editedCheckIn, "hh:mm A").format("HH:mm")} // Convert to 24-hour format
              onChange={(e) =>
                { setEditedCheckIn(moment(e.target.value, "HH:mm").format("hh:mm A")); } // Convert back to 12-hour format
              }
              helperText="Select the time you checked in"
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  paddingRight: "10px", // Add padding for input text to prevent cutting off
                },
                "& .MuiInputLabel-root": {
                  top: "5px", // Ensure the label stays in place and doesn't shift
                },
                "& label.Mui-focused": {
                  color: "#1976d2", // Change label color when focused
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "10px", // Ensure input text has enough padding from left
                },
              }}
            />
            <TextField
              label="Check-Out Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={moment(editedCheckOut, "hh:mm A").format("HH:mm")}
              onChange={(e) =>
                { setEditedCheckOut(moment(e.target.value, "hh:mm A").format("hh:mm A")); }
              }
              helperText="Select the time you checked out"
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  paddingRight: "10px", // Add padding for input text to prevent cutting off
                },
                "& .MuiInputLabel-root": {
                  top: "5px", // Ensure the label stays in place and doesn't shift
                },
                "& label.Mui-focused": {
                  color: "#1976d2", // Change label color when focused
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "10px", // Ensure input text has enough padding from left
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, mb: 2 }}>
          <Button onClick={() => { setOpenModal(false); }} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default AttendanceTable;
