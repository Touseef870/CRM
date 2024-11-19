"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx'; // Importing xlsx library to handle Excel file reading

type EmployeeData = {
  EmployeeID: string;
  Name: string;
  Attendance: string;
  Timestamp: string;
};

const EmployeeBiometricUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<EmployeeData[] | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        readFileAsJson(selectedFile);
      }
    }
  };

  // Function to read file and convert to JSON
  const readFileAsJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const data = e.target.result as string;

        // Use xlsx to read the file content
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Assume we are reading the first sheet
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const json: EmployeeData[] = XLSX.utils.sheet_to_json(sheet);
        setJsonData(json);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      
      {/* Show the selected file's data in JSON format */}
      {jsonData && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Parsed Data (JSON):</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default EmployeeBiometricUpload;
