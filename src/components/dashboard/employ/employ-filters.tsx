"use client";

import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface CustomersFiltersProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData?: () => void;  // Add a callback to reset data when input is cleared
}

export function CustomersFilters({ onChange, onResetData }: CustomersFiltersProps): React.JSX.Element {
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(event);
    }
  };

  // Effect to reset data when input is cleared
  React.useEffect(() => {
    if (inputValue === "") {
      if (onResetData) {
        onResetData();  // Call the reset data function when input is cleared
      }
    }
  }, [inputValue, onResetData]);

  return (
    <>
      <OutlinedInput
        value={inputValue}  // Bind the value to the state
        onChange={handleChange}  // Update the state when the input changes
        fullWidth
        placeholder="Search employee"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="1.5rem" />
          </InputAdornment>
        }
        sx={{
          width: 'auto', // Adjust width to make it smaller
          maxWidth: '250px', // Reduce the width of the search input
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            paddingLeft: 2,
            paddingRight: 2,
          },
          '& .MuiOutlinedInput-input': {
            paddingTop: 2,
            paddingBottom: 2,
          },
        }}
      />
    </>
  );
}
