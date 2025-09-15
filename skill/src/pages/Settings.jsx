import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Button, 
  Divider, 
  TextField, 
  Switch, 
  FormControlLabel, 
  FormGroup, 
  InputAdornment, 
  IconButton, 
  Alert, 
  Snackbar, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [tabValue, setTabValue] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', content: '', action: null });
  
  // Form states
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
    location: ''
  });
  
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newsletter: true,
    promotions: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    activityStatus: 'connections',
    emailVisibility: 'connections',
    searchEngines: true
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // In a real app, fetch user settings from API
        // const response = await api.get('/api/user/settings');
        // setProfile(response.data.profile);
        // setNotifications(response.data.notifications);
        // setPrivacy(response.data.privacy);
        
        // Mock data for now
        setProfile({
          firstName: currentUser?.displayName?.split(' ')[0] || '',
          lastName: currentUser?.displayName?.split(' ')[1] || '',
          email: currentUser?.email || '',
          phone: '+1 (555) 123-4567',
          bio: 'Passionate about learning and teaching new skills!',
          website: 'https://mywebsite.com',
          location: 'San Francisco, CA'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        showSnackbar('Failed to load settings', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };
  
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacy(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, update profile via API
      // await api.put('/api/user/profile', profile);
      showSnackbar('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (password.newPassword !== password.confirmPassword) {
      showSnackbar('New passwords do not match', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, update password via API
      // await api.put('/api/user/password', password);
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSnackbar('Password updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating password:', error);
      showSnackbar('Failed to update password', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    setConfirmDialog({
      open: true,
      title: 'Delete Account',
      content: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      action: confirmDeleteAccount
    });
  };
  
  const confirmDeleteAccount = async () => {
    setConfirmDialog({ ...confirmDialog, open: false });
    setIsLoading(true);
    
    try {
      // In a real app, delete account via API
      // await api.delete('/api/user/account');
      await logout();
      navigate('/');
      showSnackbar('Your account has been deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting account:', error);
      showSnackbar('Failed to delete account', 'error');
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      showSnackbar('Failed to log out', 'error');
    }
  };
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  if (isLoading && tabValue === 'profile') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left Navigation */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <List component="nav" sx={{ '& .Mui-selected': { bgcolor: 'action.selected' } }}>
              <ListItem 
                button 
                selected={tabValue === 'profile'}
                onClick={() => setTabValue('profile')}
              >
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem 
                button 
                selected={tabValue === 'password'}
                onClick={() => setTabValue('password')}
              >
                <ListItemIcon><LockIcon /></ListItemIcon>
                <ListItemText primary="Password" />
              </ListItem>
              <ListItem 
                button 
                selected={tabValue === 'notifications'}
                onClick={() => setTabValue('notifications')}
              >
                <ListItemIcon><NotificationsIcon /></ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>
              <ListItem 
                button 
                selected={tabValue === 'privacy'}
                onClick={() => setTabValue('privacy')}
              >
                <ListItemIcon><SecurityIcon /></ListItemIcon>
                <ListItemText primary="Privacy" />
              </ListItem>
              <ListItem 
                button 
                selected={tabValue === 'billing'}
                onClick={() => setTabValue('billing')}
              >
                <ListItemIcon><PaymentIcon /></ListItemIcon>
                <ListItemText primary="Billing" />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
          
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAccount}
            sx={{ mt: 2 }}
          >
            Delete Account
          </Button>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Profile Settings */}
          {tabValue === 'profile' && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Profile Information</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your profile information and personal details.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                <Avatar
                  src={currentUser?.photoURL}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                  Change Photo
                </Button>
              </Box>
              
              <Box component="form" onSubmit={handleSubmitProfile}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={profile.website}
                      onChange={handleProfileChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LanguageIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}
          
          {/* Password Settings */}
          {tabValue === 'password' && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Change Password</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your password to keep your account secure.
              </Typography>
              
              <Box component="form" onSubmit={handleSubmitPassword} sx={{ maxWidth: 600, mt: 4 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type={showPassword.current ? 'text' : 'password'}
                  value={password.currentPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => toggleShowPassword('current')}
                          edge="end"
                        >
                          {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => toggleShowPassword('new')}
                          edge="end"
                        >
                          {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => toggleShowPassword('confirm')}
                          edge="end"
                        >
                          {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box sx={{ mt: 3 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Notification Settings */}
          {tabValue === 'notifications' && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage how you receive notifications.
              </Typography>
              
              <Box sx={{ mt: 3, maxWidth: 700 }}>
                <FormGroup>
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={notifications.email} 
                        onChange={handleNotificationChange} 
                        name="email"
                        color="primary"
                      />
                    } 
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive email notifications about account activity, messages, and updates.
                  </Typography>
                  
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={notifications.push} 
                        onChange={handleNotificationChange} 
                        name="push"
                        color="primary"
                      />
                    } 
                    label="Push Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive push notifications on your device for important updates.
                  </Typography>
                  
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={notifications.newsletter} 
                        onChange={handleNotificationChange} 
                        name="newsletter"
                        color="primary"
                      />
                    } 
                    label="Newsletter"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Subscribe to our newsletter for the latest updates and tips.
                  </Typography>
                  
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={notifications.promotions} 
                        onChange={handleNotificationChange} 
                        name="promotions"
                        color="primary"
                      />
                    } 
                    label="Promotional Emails"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive promotional emails about our products and services.
                  </Typography>
                </FormGroup>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  startIcon={<CheckIcon />}
                >
                  Save Preferences
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Privacy Settings */}
          {tabValue === 'privacy' && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Control your privacy settings and data sharing preferences.
              </Typography>
              
              <Box sx={{ mt: 3, maxWidth: 700 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>Profile Visibility</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Who can see your profile information
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="profileVisibility"
                    value={privacy.profileVisibility}
                    onChange={handlePrivacyChange}
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="public">Public (Anyone on the internet)</MenuItem>
                    <MenuItem value="connections">Connections Only</MenuItem>
                    <MenuItem value="private">Only Me</MenuItem>
                  </TextField>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>Activity Status</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Who can see your activity status
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="activityStatus"
                    value={privacy.activityStatus}
                    onChange={handlePrivacyChange}
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="connections">Connections Only</MenuItem>
                    <MenuItem value="private">Only Me</MenuItem>
                  </TextField>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>Email Visibility</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Who can see your email address
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="emailVisibility"
                    value={privacy.emailVisibility}
                    onChange={handlePrivacyChange}
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="connections">Connections Only</MenuItem>
                    <MenuItem value="private">Only Me</MenuItem>
                  </TextField>
                </Box>
                
                <FormGroup>
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={privacy.searchEngines} 
                        onChange={handlePrivacyChange} 
                        name="searchEngines"
                        color="primary"
                      />
                    } 
                    label="Search Engine Visibility"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Allow search engines to index your profile in search results.
                  </Typography>
                </FormGroup>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 2 }}
                  startIcon={<CheckIcon />}
                >
                  Save Privacy Settings
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Billing Settings */}
          {tabValue === 'billing' && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Billing & Payments</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage your subscription and payment methods.
              </Typography>
              
              <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Current Plan</Typography>
                  <Chip label="Free Plan" color="primary" variant="outlined" />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  You're currently on the free plan. Upgrade to unlock premium features.
                </Typography>
                
                <Button variant="contained" color="primary">
                  Upgrade Plan
                </Button>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Payment Methods</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 40, height: 25, mr: 2, bgcolor: 'background.paper' }}>
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                        alt="Visa" 
                        style={{ width: '100%', height: 'auto' }} 
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Visa ending in 4242</Typography>
                      <Typography variant="caption" color="text.secondary">Expires 12/25</Typography>
                    </Box>
                  </Box>
                  <Button size="small" color="error" startIcon={<DeleteOutlineIcon />}>
                    Remove
                  </Button>
                </Paper>
                
                <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 1 }}>
                  Add Payment Method
                </Button>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Billing History</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">Premium Membership</Typography>
                    <Typography variant="body2">$9.99</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Billed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDialog.action} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
