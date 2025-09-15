import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Link as MuiLink,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import PublicRoute from '../../components/common/PublicRoute';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, error: authError, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Clear errors when component mounts
  useEffect(() => {
    setFormError('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return setFormError('Please fill in all required fields');
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return setFormError('Please enter a valid email address');
    }
    
    try {
      setIsSubmitting(true);
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (!result.success) {
        setFormError(result.error || 'Login failed. Please try again.');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSocialLogin = (provider) => {
    // In a real app, this would redirect to the OAuth provider
    console.log(`Logging in with ${provider}`);
    // For demo, we'll just show an alert
    alert(`In a real app, this would redirect to ${provider} OAuth`);
  };

  return (
    <PublicRoute restricted>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: { xs: 4, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              width: '100%', 
              borderRadius: 2,
              maxWidth: 500
            }}
          >
            <Typography 
              component="h1" 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2
              }}
            >
              Welcome Back
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              align="center" 
              sx={{ mb: 4 }}
            >
              Sign in to continue to SkillShare Hub
            </Typography>
            
            {/* Social Login Buttons */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => handleSocialLogin('Google')}
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    onClick={() => handleSocialLogin('GitHub')}
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    GitHub
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FacebookIcon color="primary" />}
                    onClick={() => handleSocialLogin('Facebook')}
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    Facebook
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>
            </Box>
            
            {/* Error Alert */}
            {(formError || authError) && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                {formError || authError}
              </Alert>
            )}
            
            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting || authLoading}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting || authLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
                mb: 3
              }}>
                <MuiLink 
                  component={Link} 
                  to="/forgot-password" 
                  variant="body2"
                  underline="hover"
                >
                  Forgot password?
                </MuiLink>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || authLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 3,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {(isSubmitting || authLoading) ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/register" 
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'none',
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </PublicRoute>
  );
};

export default Login;
