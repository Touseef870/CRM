"use client"

import { useState } from 'react';
import EmployeeBiometricUpload from './EmployeeBiometricUpload';

type EmployeeData = {
  EmployeeID: string;
  Name: string;
  Attendance: string;
  Timestamp: string;
};

const EmployeeBiometric = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>(''); // For upload status message

  // Handle file upload success and update employee data
  const handleFileUpload = (data: EmployeeData[]) => {
    if (data.length === 0) {
      setUploadStatus('No data found in the file!');
    } else {
      setEmployeeData(data);
      setUploadStatus('Upload Successful');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Employee Biometric Data</h1>

      {/* File upload component */}
      <EmployeeBiometricUpload onFileUpload={handleFileUpload} />

      {/* Display upload status */}
      {uploadStatus && (
        <p className={`mt-4 text-lg ${uploadStatus.includes('Successful') ? 'text-green-500' : 'text-red-500'}`}>
          {uploadStatus}
        </p>
      )}

      <h2 className="mt-8 text-xl font-semibold">Employee Data</h2>
      {employeeData.length === 0 ? (
        <p>No employee data available to display.</p>
      ) : (
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Employee ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Attendance</th>
              <th className="border px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{row.EmployeeID}</td>
                <td className="border px-4 py-2">{row.Name}</td>
                <td className="border px-4 py-2">{row.Attendance}</td>
                <td className="border px-4 py-2">{row.Timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeBiometric;
