'use client'

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { teal } from "@mui/material/colors";

const user = {
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  jobTitle: 'Senior Developer',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;



export function AccountInfo(): React.JSX.Element {


  const [loginData, setLoginData] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Now it is safe to use localStorage in the browser
      const storedData = localStorage.getItem("AdminloginData");
      if (storedData) {
        setLoginData(JSON.parse(storedData)); // Parse and store the data
      }
    }
  }, []);
  const { name, email, cnic, avatar } = loginData || {};

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar
              src={avatar || "T"}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                bgcolor: teal[500],
                color: "common.white",
                fontSize: "2.5rem",
                fontWeight: "bold",
                border: `4px solid #ffffff`,
                boxShadow: 3,
                '@media (max-width:600px)': {
                  width: 100,
                  height: 100,
                },
              }}
            >
              {name}
            </Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {cnic}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
