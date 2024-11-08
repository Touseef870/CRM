import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import Link from 'next/link';

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

export function LatestEmploy({ employ = [], sx }: LatestEmployProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Recent Join Employ" />
      <Divider />
      <List>
        {employ.map((product, index) => (
          <ListItem divider={index < employ.length - 1} key={product.id}>
            <ListItemAvatar>
              {product.image ? (
                <Box component="img" src={product.image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
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
              primary={product.name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Joined ${dayjs(product.lastUpdated).format('MMM D, YYYY')}`}
              secondaryTypographyProps={{ variant: 'body2' }}
            />
            {/* <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton> */}
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Link href={'/dashboard/employ'} >
          <Button
            color="inherit"
            endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
