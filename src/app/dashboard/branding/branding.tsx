'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';

import { BrandingCard } from '@/components/dashboard/branding/branding-card';
import type { Integration } from '@/components/dashboard/branding/branding-card';
import { CompaniesFilters } from '@/components/dashboard/branding/branding-filters';
import { useState } from 'react';


const branding = [
  {
    id: 'INTEG-006',
    title: 'Dropbox',
    description: 'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
    logo: '/assets/logo-dropbox.png',
    installs: 594,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-005',
    title: 'Medium Corporation',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    logo: '/assets/logo-medium.png',
    installs: 625,
    updatedAt: dayjs().subtract(43, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'INTEG-004',
    title: 'Slack',
    description: 'Slack is a cloud-based set of team collaboration tools and services, founded by Stewart Butterfield.',
    logo: '/assets/logo-slack.png',
    installs: 857,
    updatedAt: dayjs().subtract(50, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 'INTEG-003',
    title: 'Lyft',
    description: 'Lyft is an on-demand transportation company based in San Francisco, California.',
    logo: '/assets/logo-lyft.png',
    installs: 406,
    updatedAt: dayjs().subtract(7, 'minute').subtract(4, 'hour').subtract(1, 'day').toDate(),
  },
  {
    id: 'INTEG-002',
    title: 'GitHub',
    description: 'GitHub is a web-based hosting service for version control of code using Git.',
    logo: '/assets/logo-github.png',
    installs: 835,
    updatedAt: dayjs().subtract(31, 'minute').subtract(4, 'hour').subtract(5, 'day').toDate(),
  },
  {
    id: 'INTEG-001',
    title: 'Squarespace',
    description: 'Squarespace provides software as a service for website building and hosting. Headquartered in NYC.',
    logo: '/assets/logo-squarespace.png',
    installs: 435,
    updatedAt: dayjs().subtract(25, 'minute').subtract(6, 'hour').subtract(6, 'day').toDate(),
  },
  // Added 6 more brands:
  {
    id: 'INTEG-007',
    title: 'Spotify',
    description: 'Spotify is a digital music service that gives you access to millions of songs and podcasts.',
    logo: '/assets/logo-spotify.png',
    installs: 1200,
    updatedAt: dayjs().subtract(10, 'minute').toDate(),
  },
  {
    id: 'INTEG-008',
    title: 'Airbnb',
    description: 'Airbnb is an online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities.',
    logo: '/assets/logo-airbnb.png',
    installs: 985,
    updatedAt: dayjs().subtract(15, 'minute').subtract(2, 'hour').toDate(),
  },
  {
    id: 'INTEG-009',
    title: 'Uber',
    description: 'Uber Technologies, Inc. is a multinational ride-hailing company that offers services such as ride-sharing, ride-hailing, food delivery, package delivery, couriers, freight transportation, and a partnership with Lime scooters and bikes.',
    logo: '/assets/logo-uber.png',
    installs: 1300,
    updatedAt: dayjs().subtract(45, 'minute').toDate(),
  },
  {
    id: 'INTEG-010',
    title: 'Amazon',
    description: 'Amazon is an online retailer and cloud services company that offers a variety of products and services.',
    logo: '/assets/logo-amazon.png',
    installs: 5000,
    updatedAt: dayjs().subtract(30, 'minute').subtract(5, 'hour').toDate(),
  },
  {
    id: 'INTEG-011',
    title: 'Facebook',
    description: 'Facebook is an online social media and social networking service owned by Meta Platforms.',
    logo: '/assets/logo-facebook.png',
    installs: 3500,
    updatedAt: dayjs().subtract(1, 'hour').toDate(),
  },
  {
    id: 'INTEG-012',
    title: 'Twitter',
    description: 'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
    logo: '/assets/logo-twitter.png',
    installs: 2500,
    updatedAt: dayjs().subtract(2, 'hour').subtract(3, 'day').toDate(),
  },
  {
    id: 'INTEG-013',
    title: 'YouTube',
    description: 'YouTube is an American online video sharing platform where users can upload, view, and share videos.',
    logo: '/assets/logo-youtube.png',
    installs: 7000,
    updatedAt: dayjs().subtract(5, 'minute').toDate(),
  }
] satisfies Integration[];

export default function BrandingPage(): React.JSX.Element {
  const [brandName, setBrandName] = useState<string>('');
  const [filteredBranding, setFilteredBranding] = useState(branding); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 6; 

  const handleBrandEmploy = (value: string) => {
    setBrandName(value);
    const filteredData = branding.filter((brand) =>
      brand.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBranding(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBranding.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Branding</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>

      <CompaniesFilters onChange={(e) => handleBrandEmploy(e.target.value)} />

      <Grid container spacing={3}>
        {currentItems.map((branding) => (
          <Grid key={branding.id} lg={4} md={6} xs={12}>
            <BrandingCard integration={branding} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredBranding.length / itemsPerPage)}
          page={currentPage} 
          onChange={handlePageChange}
          size="small"
        />
      </Box>
    </Stack>
  );
}