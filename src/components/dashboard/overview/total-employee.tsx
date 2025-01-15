import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { UsersThree } from '@phosphor-icons/react/dist/ssr/UsersThree';

export interface TotalEmployeeProps {
  sx?: SxProps;
  value: any;
  loading: boolean;
}

export function TotalEmployee({ value, sx, loading }: TotalEmployeeProps): React.JSX.Element {
  const [animatedValue, setAnimatedValue] = React.useState(0);

  // Effect to animate the value from 0 to the given value
  React.useEffect(() => {
    if (loading) return; // Skip animation if loading
    let start = 0;
    const end = value;
    const duration = 2000; // Animation duration (2 seconds)
    const stepTime = 50; // Interval time (50ms between steps)
    const totalSteps = Math.floor(duration / stepTime);
    const increment = (end - start) / totalSteps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(interval);
        setAnimatedValue(end); // Ensure it doesn't exceed the target
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, stepTime);

    // Clean up interval on unmount or value change
    return () => clearInterval(interval);
  }, [value, loading]);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Total Employee
              </Typography>
              {loading ? (
                <div className="flex space-x-2 justify-left items-center bg-white dark:invert">
                  <span className="sr-only">Loading...</span>
                  <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-black rounded-full animate-bounce" />
                </div>
              ) : (
                <Typography variant="h4" sx={{ marginTop: 1 }}>{animatedValue}</Typography>
              )}

            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <UsersThree fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
         
        </Stack>
      </CardContent>
    </Card>
  );
}
