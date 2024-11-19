'use client'

import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Dashboard, Home, PersonAdd, PersonSearch, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleListItemClick = () => {
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('AdminloginData') || '{}');
    setUserType(adminData?.type || null);
  }, []);

  const menuItems = [
    { text: 'Home', icon: <Home />, href: '/dashboard' }, // "Home" now links to the dashboard
    { text: 'Create Sub-Admin', icon: <Dashboard />, slug: 'create-sub-admin' },
    { text: 'Create Employee', icon: <PersonAdd />, slug: 'create-employee' },
    { text: 'Create Client', icon: <PersonSearch />, slug: 'create-client' },
  ];

  const filteredMenuItems =
    userType === 'admin'
      ? menuItems
      : userType === 'employee'
        ? menuItems.filter(item => item.slug === 'create-client')
        : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isSmallScreen && (
        <IconButton
          sx={{
            position: 'relative',
            top: 16,
            left: 16,
            zIndex: 1000,
            color: '#fff',
            padding: '1rem',
            backgroundColor: '#000',
            '&:hover': {
              backgroundColor: '#141414',
            },
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon sx={{ color: '#fff', fontSize: '2rem' }} />
        </IconButton>
      )}

      <Drawer
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            background: '#000',
            color: '#ffffff',
            padding: '16px',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          },
        }}
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Create Account</h2>
        <List sx={{ width: '100%' }}>
          {filteredMenuItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={item.href || `?slug=${item.slug}`} // Use href for Home and slug for others
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
              onClick={handleListItemClick}
            >
              <ListItemIcon sx={{ color: '#0335fc' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#000',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
