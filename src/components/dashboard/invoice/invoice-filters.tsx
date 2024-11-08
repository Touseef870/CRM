"use client"; // This makes the component a client component

import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface InvoiceFilterProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InvoiceFilter({ onChange }: InvoiceFilterProps): React.JSX.Element {
  return (
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search Invoice"
      startAdornment={
        <InputAdornment position="start">
          <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
        </InputAdornment>
      }
      onChange={onChange}
      sx={{ maxWidth: '500px', m : 2 }}
    />
    // <Card >
    // </Card>
  );
}
