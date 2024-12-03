'use client'
import { IconButton } from '@mui/material'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'


const BackIcon: React.FC = () => {
    const handleBackClick = () => {
        window.history.back();
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
