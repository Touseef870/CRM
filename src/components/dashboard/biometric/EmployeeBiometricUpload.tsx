'use client'

import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Ensure you have this installed (npm install xlsx)
import { Button, TextField, Typography, Box, Grid } from '@mui/material';

interface EmployeeData {
  employeeName: string;
  managerName: string;
  ratePerHour: string;
  month: string;
  weekData: {
    date: string;
    totalHours: string;
    day: string;
    timeIn1: string;
    timeOut1: string;
    timeIn2: string;
    timeOut2: string;
  }[];
}

interface FileUploadProps {
  onFileUpload: (data: EmployeeData) => void;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name); // Set file name

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const data = e.target.result as ArrayBuffer;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Assume the first sheet
          const sheet = workbook.Sheets[sheetName];
          const json: any[] = XLSX.utils.sheet_to_json(sheet);

          // Mapping the Excel data to EmployeeData structure
          const parsedData: EmployeeData = {
            employeeName: json[0]?.EmployeeName ?? '',
            managerName: json[0]?.ManagerName ?? '',
            ratePerHour: json[0]?.RatePerHour ?? '',
            month: json[0]?.Month ?? '',
            weekData: json.map((week) => ({
              date: week['Week Starting'],
              totalHours: week['Hours Worked'],
              day: week['Day'] ?? '',
              timeIn1: week['Time In 1'] ?? '',
              timeOut1: week['Time Out 1'] ?? '',
              timeIn2: week['Time In 2'] ?? '',
              timeOut2: week['Time Out 2'] ?? ''
            })),
          };

          onFileUpload(parsedData); // Pass the parsed data to parent component
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {fileName && <Typography variant="body1">File: {fileName}</Typography>}
    </div>
  );
};

export default FileUploadComponent;
