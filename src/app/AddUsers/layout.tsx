'use client';

import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Dashboard, PersonAdd, PersonSearch, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

// Define a prop type for children, which is a ReactNode
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false); // State to control Drawer visibility
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg')); // Detect if screen is small

  const toggleDrawer = () => {
    setOpen(!open); // Toggle Drawer visibility
  };

  const handleListItemClick = () => {
    if (isSmallScreen) {
      setOpen(false); // Close the drawer when a list item is clicked on small screens
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Toggle Button */}
      {isSmallScreen && (
        <IconButton
          sx={{
            position: 'relative',
            top: 16,
            left: 16,
            zIndex: 1000,
            color: '#fff',
            padding: '1rem',
            backgroundColor: '#000', // Dark blue background
            '&:hover': {
              backgroundColor: '#141414', // Dark blue background on hover
            },
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon sx={{ color: '#fff', fontSize: '2rem' }} />
        </IconButton>
      )}

      {/* Sidebar with MUI Drawer */}
      <Drawer
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            background: '#000', // Dark blue background
            color: '#ffffff', // White text
            padding: '16px',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          },
        }}
        variant={isSmallScreen ? 'temporary' : 'permanent'} // Make the drawer temporary on small screens
        anchor="left"
        open={open}
        onClose={toggleDrawer} // Close the drawer when clicked outside (for mobile)
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Create Account</h2>
        <List sx={{ width: '100%' }}>
          {[{ text: 'Create Sub-Admin', icon: <Dashboard />, slug: 'create-sub-admin' },
            { text: 'Create Employee', icon: <PersonAdd />, slug: 'create-employee' },
            { text: 'Create Client', icon: <PersonSearch />, slug: 'create-client' }, // Fixed typo here
          ].map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={`?slug=${item.slug}`} // Add slug as query parameter
              sx={{
                '&:hover': {
                  transform: 'scale(1.03)',
                  cursor: 'pointer',
                },
                transition: 'all 0.3s ease',
                borderRadius: 2,
                backgroundColor: '#fff',
                mb: 2,
                padding: '12px 16px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              }}
              onClick={handleListItemClick} // Close the drawer on item click (on small screens)
            >
              <ListItemIcon sx={{ color: '#0335fc' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#000', // Black text
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
