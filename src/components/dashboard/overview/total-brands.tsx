import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { LinearProgress } from '@mui/material';

export interface TotalBrandsProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: number;
  loading: boolean;
}

export function TotalBrands({ diff, trend, sx, value, loading }: TotalBrandsProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  // State for the animated value
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    if (loading) return; // Skip animation when loading

    let start = 0;
    const end = value;
    const duration = 2000; // Animation duration in milliseconds
    const stepTime = 50; // Time between each update in milliseconds
    const totalSteps = Math.floor(duration / stepTime);
    const increment = (end - start) / totalSteps;

    // Interval to animate the value
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(interval);
        setAnimatedValue(end); // Ensure it doesn't exceed the target
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, stepTime);

    // Clean up interval when component unmounts or value changes
    return () => clearInterval(interval);
  }, [value, loading]); // Re-run if value or loading changes

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Brands
              </Typography>
              {loading ? (
                <div className="flex space-x-2 justify-left items-center bg-white dark:invert">
                  <span className="sr-only">Loading...</span>
                  <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-black rounded-full animate-bounce" />
                </div>
              ) : (
<Typography variant="h4" sx={{ marginTop: 5 }}>
  {animatedValue}
</Typography>
              )}

            </Stack>
            <Avatar sx={{ backgroundColor: trendColor, height: '56px', width: '56px' }}>
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          
        </Stack>
      </CardContent>
    </Card>
  );
}
