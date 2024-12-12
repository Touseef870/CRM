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
import Swal from "sweetalert2";
import { Edit, Schedule } from "@mui/icons-material";

interface AttendanceRow {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  present: string;
  _id: string;
}

const AttendanceTable: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<AttendanceRow | null>(null);
  const [editedCheckIn, setEditedCheckIn] = useState<string>("");
  const [editedCheckOut, setEditedCheckOut] = useState<string>("");
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
          console.log("Error fetching attendance data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    } else {
      console.log("No ID provided");
    }
  }, [id, token]);


  useEffect(() => {
    if (id) {
      const fetchAttendanceData = async () => {
        try {
          const response = await axios.get(
            `https://api-vehware-crm.vercel.app/api/attendance/get/single/${id}`,
            //  // Adjust API endpoint
            { 
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setAttendanceData(response.data.data); // Expecting a single record
        } catch (err) {
          console.log("Error fetching attendance data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    } else {
      console.log("No ID provided");
    }
  }, [id, token]);








  const handleEdit = (row: AttendanceRow) => {
    setEditingRow(row);
    setEditedCheckIn(moment(row.checkInTime).format("HH:mm"));
    setEditedCheckOut(moment(row.checkOutTime).format("HH:mm"));
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const formattedDate = moment(editingRow.date, "DD-MM-YYYY").format("YYYY-MM-DD");

      const formattedCheckIn = moment(editedCheckIn, "hh:mm A").format("HH:mm");
      const formattedCheckOut = moment(editedCheckOut, "hh:mm A").format("HH:mm");

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
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = '9999'; // Set z-index to bring it to the front
          }
        },
      });

      setOpenModal(false);

    } catch (err) {
      console.log("Error saving updated attendance data:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update attendance. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal2-popup',
        },
        didOpen: () => {
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = '9999';
          }
        },
      });

      setOpenModal(false);

    }
  };



  console.log(attendanceData, "attendanceData")

  return (

    <Box sx={{ margin: "30px" }}>


      {loading ? (
        <Box sx={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{

            overflow: "hidden",
            boxShadow: 3,
            padding: "16px",
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
                attendanceData.map((data) => (
                  <TableRow
                    key={data._id}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "grey.100" },
                      "&:nth-of-type(even)": { bgcolor: "grey.50" },
                      "&:hover": {
                        bgcolor: "#abacc4",
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
                        startIcon={<Edit />}
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

      <Dialog
        open={openModal}
        onClose={() => { setOpenModal(false); }}
        fullWidth
        maxWidth="sm"
        sx={{
          zIndex: 13010,
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
              value={moment(editedCheckIn, "hh:mm A").format("HH:mm")}
              onChange={(e) => { setEditedCheckIn(moment(e.target.value, "HH:mm").format("hh:mm A")); }
              }
              helperText="Select the time you checked in"
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  paddingRight: "10px",
                },
                "& .MuiInputLabel-root": {
                  top: "5px",
                },
                "& label.Mui-focused": {
                  color: "#1976d2",
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "10px",
                },
              }}
            />
            <TextField
              label="Check-Out Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={moment(editedCheckOut, "hh:mm A").format("HH:mm")}
              onChange={(e) => { setEditedCheckOut(moment(e.target.value, "hh:mm A").format("hh:mm A")); }
              }
              helperText="Select the time you checked out"
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  paddingRight: "10px",
                },
                "& .MuiInputLabel-root": {
                  top: "5px",
                },
                "& label.Mui-focused": {
                  color: "#1976d2",
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "10px",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, mb: 2 }}>
          <Button onClick={() => { setOpenModal(false); }} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<Schedule />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceTable;
