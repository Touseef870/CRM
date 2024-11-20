// page.tsx
'use client';

import React, { useState } from 'react';
import EmployeeBiometric from '../../../components/dashboard/biometric/employee-biometric';
import FileUploadComponent from '../../../components/dashboard/biometric/EmployeeBiometricUpload'; // Corrected import path

function DashboardPage() {
  const [employeeData, setEmployeeData] = useState<any>(null);

  const handleFileUpload = (data: any) => {
    setEmployeeData(data); // Store the employee data from file upload
  };

  return (
    <>
      <FileUploadComponent onFileUpload={handleFileUpload} /> {/* File upload component */}
      {employeeData && <EmployeeBiometric employeeData={employeeData} />} {/* Pass data as a prop */}
    </>
  );
}

export default DashboardPage;
