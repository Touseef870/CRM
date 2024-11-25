import EmployeeDetails from '@/components/dashboard/employ/EmolyeeDetails'
import React from 'react'
import AttendanceTable from './EmployeeAttendance';

function page() {


    const dummyData = [
        { date: "2024-11-20", checkIn: "09:00 AM", checkOut: "05:00 PM", present: "Yes" },
        { date: "2024-11-21", checkIn: "09:15 AM", checkOut: "05:30 PM", present: "No" },
        { date: "2024-11-22", checkIn: "08:50 AM", checkOut: "04:50 PM", present: "Yes" },
      ];
  return (



    <div><EmployeeDetails />
    <AttendanceTable attendanceData={dummyData} />
    </div>

    
  )
}

export default page