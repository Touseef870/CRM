"use client";

import * as React from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import { TotalEmployee } from "@/components/dashboard/overview/total-employee";
import { TotalInvoices } from "@/components/dashboard/overview/total-invoices";
import { TotalBrands } from "@/components/dashboard/overview/total-brands";
import { TotalCustomers } from "@/components/dashboard/overview/total-customers";
import { LatestEmploy } from "@/components/dashboard/overview/latest-employ";
import { LatestInvoice } from "@/components/dashboard/overview/latest-invoice";
import { AppContext } from "@/contexts/isLogin";

export default function Page(): React.JSX.Element {
  const { storedValue } = useContext(AppContext)!;
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalInvoices: 0,
    totalBrands: 0,
    totalCustomers: 0,

  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       
        const response = await axios.get(
          "https://api-vehware-crm.vercel.app/api/totalData", // Replace with your actual API endpoint
          {
            headers: {
              Authorization: `Bearer ${storedValue.token}`, // Use the token from the context
            },
          }
        );

        setDashboardData({
          totalEmployees: response.data.data.totalEmployees,
          totalInvoices: response.data.data.totalOrders,
          totalBrands: response.data.data.totalBrands,
          totalCustomers: response.data.data.totalClients,
        });
        setLoading(false);
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
        setLoading(false);

      }
    };

    if (typeof window !== "undefined") {
      fetchDashboardData();
    }
  }, [storedValue.token]); 


  return (
    <Grid container spacing={3}>
       <Grid lg={3} sm={6} xs={12}>
        <TotalEmployee sx={{ height: '100%' }} 
        value={dashboardData.totalEmployees} 
        loading={loading}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalInvoices sx={{ height: '100%' }} value={dashboardData.totalInvoices} 
        loading={loading}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalBrands
          diff={12}
          trend="up"
          loading={loading}
          sx={{ height: '100%' }}
          value={dashboardData.totalBrands}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers
          loading={loading}

          diff={16}
          trend="up"
          sx={{ height: '100%' }}
          value={dashboardData.totalCustomers}
        />
      </Grid>
       {/* <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid> */}
      {/* <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      */}
      <Grid lg={4} md={6} xs={12}>
        <LatestEmploy
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} xs={12}>
        <LatestInvoice
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
