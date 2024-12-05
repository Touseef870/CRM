'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectChangeEvent
} from "@mui/material";
import Swal from "sweetalert2";
import BackIcon from "@/components/BackIcon";
import { FiTrash } from "react-icons/fi";
import { grey, teal, red } from "@mui/material/colors";

interface Employee {
  _id: string;
  cnic: string;
  dob: string;
  email: string;
  gender: string;
  name: string;
  phone: string;
  salary: number;
  type: string;
  avatar?: string;
  serviceType: string;
  country: string;
}

export default function EmployeeDetails() {
  const params = useParams();
  const id = params?.id;
  console.log(id)

  const router = useRouter(); // To redirect after deletion
  const [deleteError, setDeleteError] = useState<string | null>(null); // For delete errors
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false); // State to handle modal visibility
  
  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;
  
  
  
  
  

  const [orderData, setOrderData] = useState({
    brandId: '',
    clientId: id,
    title: '',
    description: '',
    price: '',
  }); // State to hold order form data









  const handleModalClose = () => {
    setOpenModal(false); 
  };

  const handleModalOpen = () => {
    setOpenModal(true); 
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDropdownChange = (e: SelectChangeEvent<string>) => {
    setOrderData(prevState => ({
      ...prevState,
      brandId: e.target.value,  
    }));
  };

  const handleOrderSubmit =async () => {
    // Ensure all fields are filled
    if (!orderData.title || !orderData.price || !orderData.description || !orderData.brandId) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
  
    console.log(orderData);


    try {
      const response = await axios.post(
        'https://api-vehware-crm.vercel.app/api/order/create-order',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response) {
        Swal.fire({
          title: "Successfully Created!",
          text: "Thank You",
          icon: "success",
        })
      }

    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: "Invalid credentials",
        icon: "error",
      })
    }
  
    // setOrderData({
    //   title: '',
    //   price: '',
    //   description: '',
    //   brandId: '',
    //   clientId: '',  
    // });
  
    handleModalClose();
  };
  






















  useEffect(() => {
    if (!id) {
      setError("Employee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        if (!token) {
          throw new Error("Token is missing in admin login data");
        }

        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/credentials/client/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployee(response.data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    try {
      const adminLoginData = localStorage.getItem("AdminloginData");

      if (!adminLoginData) {
        throw new Error("Admin login data is missing");
      }

      const parsedData = JSON.parse(adminLoginData);

      if (!parsedData.token) {
        throw new Error("Token is missing in admin login data");
      }

      await axios.delete(
        `https://api-vehware-crm.vercel.app/api/auth/delete-client/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedData.token}`,
          },
        }
      );

      Swal.fire("Deleted!", "Employee deleted successfully.", "success");
      setEmployee(null);
      setTimeout(() => {
        router.push("/dashboard/employ"); // Redirect to the employee list page
      }, 2000);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete the employee"
      );
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true, // Show the "No" (Cancel) button
      confirmButtonColor: "#d33", // Red color for the "Yes" button
      cancelButtonColor: "#3085d6", // Blue color for the "No" button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!", // Text for the "No" button
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks "Yes"
        handleDelete(); // Proceed with the deletion
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If the user clicks "No" (Cancel)
        Swal.fire("Cancelled", "The employee was not deleted.", "info");
      }
    });
  };



  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          Client not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: grey[100],
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Grid item xs={12} sx={{ position: "absolute", top: 16, left: 16 }}>
        <BackIcon />
      </Grid>

      <Grid item xs={12} sx={{ position: "absolute", top: 16, right: 16 }}>
        <IconButton
          onClick={confirmDelete}
          sx={{
            color: red[700],
            borderRadius: "5px",
            display: "flex",
            justifyContent: "flex-end",
            "&:hover": {
              backgroundColor: red[800],
              color: "white"
            },
            marginBottom: 2,
          }}
        >
          <FiTrash size={30} />
        </IconButton>
      </Grid>

      <Grid
        container
        spacing={4}
        maxWidth="lg"
        sx={{
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: teal[700],
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Client Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  boxShadow: 6,
                  borderRadius: 4,
                  background: `linear-gradient(to bottom, ${teal[50]}, #fff)`,
                  border: `1px solid ${grey[300]}`,
                  "&:hover": {
                    boxShadow: 10,
                  },
                }}
              >
                <Avatar
                  src={employee.avatar || ""}
                  sx={{
                    width: { xs: 100, sm: 140 },
                    height: { xs: 100, sm: 140 },
                    mb: 2,
                    bgcolor: teal[500],
                    color: "common.white",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    fontWeight: "bold",
                    border: 4,
                    boxShadow: 3,
                  }}
                >
                  {employee.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: teal[800],
                    textTransform: "capitalize",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {employee.name}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {employee.type.toUpperCase()}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 4,
                  backgroundColor: "#ffffff",
                  p: 3,
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: teal[700],
                    mb: 2,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: grey[300] }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Service:</strong> {employee.serviceType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Email:</strong> {employee.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Phone:</strong> {employee.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Country:</strong> {employee.country}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" onClick={handleModalOpen}>
          Add Order
        </Button>
      </Grid>

      {deleteError && (
        <Typography
          variant="body2"
          color="error"
          sx={{
            mt: 3,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.75rem", sm: "1rem" },
          }}
        >
          {deleteError}
        </Typography>
      )}


      {/* Modal */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Add Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={orderData.title}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Price"
            name="price"
            value={orderData.price}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
            type="number"
          />
          <TextField
            label="Description"
            name="description"
            value={orderData.description}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Dropdown</InputLabel>
            <Select
              value={orderData.brandId}
              onChange={handleDropdownChange}
              label="Dropdown"
            >
              <MenuItem value={2002}>One</MenuItem>
              <MenuItem value={2004}>Two</MenuItem>
              <MenuItem value={2005}>Three</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOrderSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>







    </Box>

  );



}
