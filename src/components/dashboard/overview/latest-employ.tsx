'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import axios from 'axios';

export interface Employ {
  id: string;
  image: string;
  name: string;
  position: string;
  department: string;
  lastUpdated: Date;
}

export interface LatestEmployProps {
  employ?: Employ[];
  sx?: SxProps;
}

export const LatestEmploy: React.FC<LatestEmployProps> = ({ employ = [], sx }) => {
  const [userType, setUserType] = useState<string>('');
  const [employData, setEmployData] = useState<Employ[]>([]);

  useEffect(() => {
    const getUserType = () => {
      const adminData = localStorage.getItem('AdminloginData');
      if (adminData) {
        try {
          const parsedData = JSON.parse(adminData);
          setUserType(parsedData.type || '');
        } catch (error) {
          console.error('Error parsing AdminloginData:', error);
        }
      }
    };

    const fetchEmployData = async () => {
      const adminData = localStorage.getItem('AdminloginData');
      if (adminData) {
        try {
          const { token } = JSON.parse(adminData);
          const response = await axios.get('https://crm-api-backend.vercel.app/api/credentials/employees', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          setEmployData(response.data.data.employees.slice(0, 4));
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      }
    };

    getUserType();
    fetchEmployData();
  }, []);

  if (userType === 'employee') return null;

  return (
    <Card sx={sx}>
      <CardHeader title="Recent Join Employ" />
      <Divider />
      <List>
        {employData.map((employee, index) => (
          <ListItem divider={index < employData.length - 1} key={employee.id}>
            <ListItemAvatar>
              {employee.image ? (
                <Box
                  component="img"
                  src={employee.image}
                  sx={{ borderRadius: 1, height: '48px', width: '48px' }}
                />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={employee.name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Joined ${dayjs(employee.lastUpdated).format('MMM D, YYYY')}`}
              secondaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Link href="/dashboard/employ" passHref>
          <Button
            color="inherit"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};
