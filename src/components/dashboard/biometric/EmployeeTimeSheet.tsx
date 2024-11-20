'use client'

import React, { useState } from 'react';
import FileUploadComponent from './EmployeeBiometricUpload'; // Ensure the path is correct
import EmployeeBiometric from './employee-biometric'; // Ensure the path is correct

const EmployeeTimeSheet: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);

  const handleFileUpload = (data: any) => {
    setEmployeeData(data);
  };

  return (
    <div>
      <h1>Employee TimeSheet</h1>
      <FileUploadComponent onFileUpload={handleFileUpload} />
      {employeeData && <EmployeeBiometric employeeData={employeeData} />}
    </div>
  );
};

export default EmployeeTimeSheet;
