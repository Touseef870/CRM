'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { usePopover } from '@/hooks/use-popover';
import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import AddIcon from '@mui/icons-material/Add';
import { ListItemIcon } from '@mui/material';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={() => { setOpenNav(true); }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/* Button to open Sign-In Form */}



            <Link
              href="/AddUsers"
              sx={{
                display: 'inline-flex', // Aligns the icon and text in a row
                alignItems: 'center', // Vertically centers the icon and text
                backgroundColor: 'blue', // Button background color
                color: 'white', // Text color
                padding: '8px 16px', // Padding for button-like appearance
                borderRadius: '4px', // Rounded corners
                fontWeight: '600', // Bold text
                fontSize: '1rem', // Font size for text
                textDecoration: 'none', // Removes underline from the link
                textAlign: 'center', // Centers the text
                transition: 'all 0.3s ease', // Smooth hover effect
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                '&:hover': {
                  backgroundColor: '#0039cb', // Darker blue on hover
                  transform: 'scale(1.05)', // Slight scale-up effect
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', // Enhanced shadow
                },
                '&:active': {
                  transform: 'scale(0.97)', // Slight press-down effect
                },
                '&:hover *': {
                  textDecoration: 'none', // Ensures no underline on hover for child elements
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'white', // Icon color white
                  marginRight: '-30px', // Reduce the gap between icon and text (set to 8px)
                  fontSize: '1.25rem', // Icon size adjusted
                }}
              >
                <AddIcon /> {/* Icon */}
              </ListItemIcon>
              Add User
            </Link>

            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>

      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => { setOpenNav(false); }}
        open={openNav}
      />
    </React.Fragment>
  );
}