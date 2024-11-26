import EmployeeDetails from '@/components/dashboard/employ/EmolyeeDetails'
import React from 'react'
import AttendanceTable from './EmployeeAttendance';

function page() {
  return (
    <div>
      <EmployeeDetails />
      <AttendanceTable />
    </div>
  );
}

export default page;
