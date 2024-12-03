'use client'
import { IconButton } from '@mui/material'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

interface BackIconProps {
    path: string; // Define the type for the 'path' prop
}

const BackIcon: React.FC<BackIconProps> = ({ path }) => {
    const handleBackClick = () => {
        window.location.href = path; // Redirect to the specified path
    };
    return (
        <div>
            <IconButton style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#6e0a80', color: 'white', borderRadius: "10px" }} onClick={handleBackClick}   >
                <FaArrowLeft />
                <span style={{ padding: "0 0.5rem" }}>Back</span>
            </IconButton>
        </div>
    )
}

export default BackIcon
