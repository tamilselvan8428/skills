import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Avatar, 
  Button, 
  Tabs, 
  Tab, 
  Paper, 
  Divider, 
  Chip, 
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Bookmark as BookmarkIcon,
  Star as StarIcon,
  Share as ShareIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkillCard from '../components/skills/SkillCard';
import { usersApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('skills');
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user's profile
  const refetch = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getProfile();
      setProfile(res.data?.data || res.data || null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { refetch(); }, []);

  // Fetch user's skills/activities based on tab
  const skills = profile?.skillsTeaching || [];
  const learning = profile?.skillsLearning || [];
  const saved = []; // can wire bookmarks later
  
  useEffect(() => {
    // In a real app, check if the current user matches the profile being viewed
    // For now, we'll assume it's the current user if no username is in the URL
    setIsCurrentUser(!username);
  }, [username]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditClick = (field, value = '') => {
    setEditField(field);
    setEditValue(value);
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = async () => {
    try {
      const payload = {};
      if (editField === 'about') payload.professionalDetails = editValue;
      if (editField === 'skills') payload.skillsToTeach = String(editValue)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      if (Object.keys(payload).length > 0) {
        await usersApi.updateProfile(payload);
      }
      
      // For now, just close the dialog and refetch the profile
      setEditDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleFollow = async () => {
    try {
      // Toggle follow status
      // await api.post(`/api/users/${profile.id}/follow`);
      refetch();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!profile) return <div>Profile not found</div>;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Avatar Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              src={profile.avatar} 
              alt={profile.name}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            {isCurrentUser && (
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => handleEditClick('avatar')}
              >
                Edit Photo
              </Button>
            )}
          </Box>
          
          {/* Profile Info */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {profile.name}
                  {profile.isVerified && (
                    <CheckIcon color="primary" sx={{ ml: 1, fontSize: '1.2rem', verticalAlign: 'middle' }} />
                  )}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {profile.professionalDetails}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, mb: 2 }}>
                  {profile.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{profile.location}</Typography>
                    </Box>
                  )}
                  
                  {profile.company && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{profile.company}</Typography>
                    </Box>
                  )}
                  
                  {profile.college && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{profile.college}</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {skills?.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                  {isCurrentUser && (
                    <IconButton size="small" onClick={() => handleEditClick('skills', skills?.join(', '))}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isCurrentUser && (
                  <Button 
                    variant={profile.isFollowing ? 'outlined' : 'contained'}
                    onClick={handleFollow}
                    size="small"
                  >
                    {profile.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
                {isCurrentUser && (
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate('/settings/profile')}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 4, mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {skills?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Skills
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {learning?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learning
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {saved?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saved
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Tabs */}
          <Paper elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs 
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                },
              }}
            >
              <Tab 
                value="skills" 
                label={`Skills (${skills?.length || 0})`} 
                iconPosition="start"
                icon={<WorkIcon fontSize="small" />}
              />
              <Tab 
                value="learning" 
                label={`Learning (${learning?.length || 0})`}
                iconPosition="start"
                icon={<SchoolIcon fontSize="small" />}
              />
              <Tab 
                value="saved" 
                label={`Saved (${saved?.length || 0})`}
                iconPosition="start"
                icon={<BookmarkIcon fontSize="small" />}
              />
            </Tabs>
          </Paper>
          
          {/* Tab Content */}
          <Box sx={{ mb: 4 }}>
            {tabValue === 'skills' && (
              <Grid container spacing={3}>
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <SkillCard skill={{ title: skill }} />
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ width: '100%', textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No skills shared yet
                    </Typography>
                    {isCurrentUser && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/teach/new')}
                      >
                        Share a Skill
                      </Button>
                    )}
                  </Box>
                )}
              </Grid>
            )}
            
            {tabValue === 'learning' && (
              <Grid container spacing={3}>
                {learning.length > 0 ? (
                  learning.map((skill, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <SkillCard skill={{ title: skill }} />
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ width: '100%', textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {isCurrentUser ? "You haven't started learning any skills yet" : "No learning activity yet"}
                    </Typography>
                    {isCurrentUser && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate('/browse')}
                      >
                        Browse Skills
                      </Button>
                    )}
                  </Box>
                )}
              </Grid>
            )}
            
            {tabValue === 'saved' && (
              <Grid container spacing={3}>
                {saved.length > 0 ? (
                  saved.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <SkillCard skill={item} />
                    </Grid>
                  ))
                ) : (
                  <Box sx={{ width: '100%', textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {isCurrentUser ? "You haven't saved any items yet" : "No saved items"}
                    </Typography>
                    {isCurrentUser && (
                      <Typography variant="body2" color="text.secondary">
                        Click the bookmark icon on any skill to save it for later
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            )}
          </Box>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* About Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                About
              </Typography>
              {isCurrentUser && (
                <IconButton size="small" onClick={() => handleEditClick('about', profile.professionalDetails || '')}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {profile.professionalDetails || (isCurrentUser ? 'Tell others about yourself' : 'No information provided')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
        </DialogTitle>
        <DialogContent>
          {editField === 'about' && (
            <TextField
              autoFocus
              margin="dense"
              id="about"
              label="About"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={6}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          )}
          
          {editField === 'skills' && (
            <TextField
              autoFocus
              margin="dense"
              id="skills"
              label="Skills (comma separated)"
              type="text"
              fullWidth
              variant="outlined"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              helperText="Enter your skills separated by commas"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
