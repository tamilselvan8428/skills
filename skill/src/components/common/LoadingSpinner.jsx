import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="textSecondary" style={{ marginTop: 16 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
