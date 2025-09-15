import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Divider, 
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Lock as LockIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const Unauthorized = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 3 : 6, 
          textAlign: 'center',
          borderRadius: 2,
          background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
        }}
      >
        <Box 
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 24px',
            borderRadius: '50%',
            backgroundColor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
          }}
        >
          <LockIcon fontSize="large" />
        </Box>
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: 2
          }}
        >
          Access Denied
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '600px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}
        >
          You don't have permission to access this page. Please check your credentials or contact support if you believe this is an error.
        </Typography>
        
        <Divider sx={{ my: 4, mx: 'auto', maxWidth: '300px' }} />
        
        <Grid 
          container 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Go Back
            </Button>
          </Grid>
          
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              Sign In
            </Button>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              onClick={handleGoHome}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Return to Homepage
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Need help?{' '}
            <Button 
              variant="text" 
              size="small" 
              sx={{ 
                p: 0, 
                minWidth: 'auto',
                textTransform: 'none',
                verticalAlign: 'baseline',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;
