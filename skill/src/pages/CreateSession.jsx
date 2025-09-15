import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  TextField, 
  Box, 
  Divider, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  FormControlLabel,
  Switch,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  Videocam as VideocamIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarToday as CalendarTodayIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  Link as LinkIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  LocationOn as LocationOnIcon,
  Computer as ComputerIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addHours, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';

const CreateSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', content: '', action: null });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillId: id || '',
    skillTitle: '',
    skillImage: '',
    skillLevel: '',
    skillCategory: '',
    sessionType: 'live', // 'live' or 'prerecorded'
    sessionFormat: 'video', // 'video', 'in_person', 'text', 'audio'
    maxParticipants: 10,
    price: 0,
    isFree: false,
    duration: 60, // in minutes
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 8),
    sessions: [
      {
        id: 1,
        date: addDays(new Date(), 1),
        startTime: new Date().setHours(10, 0, 0, 0),
        endTime: new Date().setHours(11, 0, 0, 0),
        meetingLink: '',
        location: '',
        isRecurring: false,
        recurringPattern: 'weekly',
        recurringEndDate: addDays(new Date(), 22),
        maxParticipants: 10
      }
    ],
    requirements: [],
    learningOutcomes: [],
    resources: [],
    coverImage: '',
    isPublished: false
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [expandedSession, setExpandedSession] = useState(0);
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [newResource, setNewResource] = useState({ type: 'link', url: '', title: '' });
  
  // Mock skills data - in a real app, this would come from an API
  const [skills, setSkills] = useState([
    { id: '1', title: 'React Fundamentals', level: 'Beginner', category: 'Web Development', image: 'https://source.unsplash.com/random/400x225/?react' },
    { id: '2', title: 'Advanced CSS and Sass', level: 'Intermediate', category: 'Web Design', image: 'https://source.unsplash.com/random/400x225/?css' },
    { id: '3', title: 'Node.js API Development', level: 'Intermediate', category: 'Backend Development', image: 'https://source.unsplash.com/random/400x225/?nodejs' },
  ]);
  
  // Timezone options
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];
  
  // Steps for the stepper
  const steps = [
    'Session Details',
    'Schedule',
    'Pricing',
    'Requirements & Resources',
    'Review & Publish'
  ];
  
  // Set skill details if skillId is provided in URL
  useEffect(() => {
    if (id) {
      const selectedSkill = skills.find(skill => skill.id === id);
      if (selectedSkill) {
        setFormData(prev => ({
          ...prev,
          skillId: selectedSkill.id,
          skillTitle: selectedSkill.title,
          skillImage: selectedSkill.image,
          skillLevel: selectedSkill.level,
          skillCategory: selectedSkill.category,
          title: `Live Session: ${selectedSkill.title}`
        }));
      }
    }
  }, [id, skills]);
  
  // Handle form input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [validationErrors]);
  
  // Handle session changes
  const handleSessionChange = useCallback((index, field, value) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[index] = { ...updatedSessions[index], [field]: value };
    
    // If updating start time, adjust end time to maintain duration
    if (field === 'startTime' && updatedSessions[index].endTime) {
      const start = new Date(value);
      const end = new Date(updatedSessions[index].endTime);
      const duration = (end - start) / (1000 * 60); // in minutes
      
      if (duration < 15) {
        // Ensure minimum session duration of 15 minutes
        updatedSessions[index].endTime = new Date(start.getTime() + 15 * 60000);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      sessions: updatedSessions
    }));
  }, [formData.sessions]);
  
  // Add a new session
  const addSession = () => {
    const lastSession = formData.sessions[formData.sessions.length - 1];
    const newSession = {
      id: Date.now(),
      date: lastSession.date,
      startTime: new Date(lastSession.startTime).setHours(
        new Date(lastSession.startTime).getHours() + 24,
        new Date(lastSession.startTime).getMinutes(),
        0,
        0
      ),
      endTime: new Date(lastSession.endTime).setHours(
        new Date(lastSession.endTime).getHours() + 24,
        new Date(lastSession.endTime).getMinutes(),
        0,
        0
      ),
      meetingLink: '',
      location: '',
      isRecurring: false,
      recurringPattern: 'weekly',
      recurringEndDate: addDays(new Date(lastSession.date), 21),
      maxParticipants: formData.maxParticipants
    };
    
    setFormData(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession]
    }));
    
    setExpandedSession(formData.sessions.length);
  };
  
  // Remove a session
  const removeSession = (index) => {
    if (formData.sessions.length === 1) {
      showSnackbar('You must have at least one session', 'error');
      return;
    }
    
    const updatedSessions = [...formData.sessions];
    updatedSessions.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      sessions: updatedSessions
    }));
    
    if (expandedSession >= updatedSessions.length) {
      setExpandedSession(updatedSessions.length - 1);
    }
  };
  
  // Toggle session expansion
  const toggleSessionExpansion = (index) => {
    setExpandedSession(expandedSession === index ? -1 : index);
  };
  
  // Add a requirement
  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, newRequirement.trim()]
    }));
    
    setNewRequirement('');
  };
  
  // Remove a requirement
  const removeRequirement = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };
  
  // Add a learning outcome
  const addOutcome = () => {
    if (!newOutcome.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()]
    }));
    
    setNewOutcome('');
  };
  
  // Remove a learning outcome
  const removeOutcome = (index) => {
    const updatedOutcomes = [...formData.learningOutcomes];
    updatedOutcomes.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      learningOutcomes: updatedOutcomes
    }));
  };
  
  // Add a resource
  const addResource = () => {
    if ((!newResource.url.trim() && newResource.type !== 'text') || !newResource.title.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      resources: [
        ...prev.resources,
        {
          id: Date.now(),
          ...newResource,
          addedAt: new Date().toISOString()
        }
      ]
    }));
    
    setNewResource({ type: 'link', url: '', title: '' });
  };
  
  // Remove a resource
  const removeResource = (id) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== id)
    }));
  };
  
  // Validate current step
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Session Details
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.skillId) errors.skillId = 'Please select a skill';
        if (!formData.sessionType) errors.sessionType = 'Please select a session type';
        if (!formData.sessionFormat) errors.sessionFormat = 'Please select a session format';
        if (formData.maxParticipants < 1) errors.maxParticipants = 'Must have at least 1 participant';
        break;
        
      case 1: // Schedule
        if (formData.sessions.length === 0) {
          errors.sessions = 'At least one session is required';
        } else {
          formData.sessions.forEach((session, index) => {
            if (!session.date) {
              errors[`session-${index}-date`] = 'Date is required';
            }
            if (!session.startTime) {
              errors[`session-${index}-startTime`] = 'Start time is required';
            }
            if (!session.endTime) {
              errors[`session-${index}-endTime`] = 'End time is required';
            } else if (session.startTime && session.endTime <= session.startTime) {
              errors[`session-${index}-endTime`] = 'End time must be after start time';
            }
            if (session.isRecurring && !session.recurringEndDate) {
              errors[`session-${index}-recurringEndDate`] = 'Recurring end date is required';
            }
          });
        }
        break;
        
      case 2: // Pricing
        if (!formData.isFree && formData.price < 0) {
          errors.price = 'Price cannot be negative';
        }
        break;
        
      // Other steps don't require validation
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      showSnackbar('Please fix the validation errors before submitting', 'error');
      return;
    }
    
    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const currentUser = user || JSON.parse(localStorage.getItem('user'));
      const firstSession = formData.sessions?.[0];
      
      const payload = {
        title: formData.title,
        description: formData.description,
        teacherId: currentUser._id,
        teacherName: currentUser.name || currentUser.username,
        scheduledTime: firstSession?.date || new Date().toISOString(),
        duration: Number(formData.duration) || 60,
        gmeetLink: firstSession?.meetingLink || '',
        isPublished: formData.isPublished || false,
        status: 'upcoming',
        category: formData.category || 'general',
        skills: formData.skills || [],
        price: formData.isFree ? 0 : formData.price || 0,
        maxLearners: formData.maxLearners || 1,
        sessions: formData.sessions?.map(session => ({
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          meetingLink: session.meetingLink || '',
          location: session.location || '',
          isRecurring: session.isRecurring || false,
          recurringPattern: session.recurringPattern || '',
          recurringEndDate: session.recurringEndDate || null
        })) || []
      };
      
      console.log('Submitting session:', payload); // Debug log
      
      const { sessionsApi } = await import('../services/api');
      try {
        const response = await sessionsApi.create(payload);
        console.log('Session creation response:', response);
        
        // The response from axios is { data, status, statusText, headers, config }
        // The actual session data is in response.data
        if (response && response.data && (response.data._id || response.data.id)) {
          showSnackbar('Session created successfully!', 'success');
          navigate('/teach');
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Failed to create session: Invalid response format');
        }
      } catch (error) {
        console.error('API Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
          }
        });
        throw error;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      showSnackbar('Failed to create session. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Save as draft
  const saveAsDraft = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, save as draft via API
      // await api.post('/api/sessions/draft', { ...formData, isPublished: false });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSnackbar('Draft saved successfully!', 'success');
      navigate('/teach');
    } catch (error) {
      console.error('Error saving draft:', error);
      showSnackbar('Failed to save draft. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Publish session
  const publishSession = () => {
    setConfirmDialog({
      open: true,
      title: 'Publish Session',
      content: 'Are you sure you want to publish this session? It will be visible to students after review.',
      action: async () => {
        try {
          await handleSubmit(new Event('submit'));
        } catch (error) {
          console.error('Error publishing session:', error);
          showSnackbar('Failed to publish session. Please try again.', 'error');
        }
        setIsSubmitting(true);
        
        try {
          // In a real app, publish via API
          // await api.put(`/api/sessions/${sessionId}/publish`);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          showSnackbar('Session published successfully!', 'success');
          navigate('/teach');
        } catch (error) {
          console.error('Error publishing session:', error);
          showSnackbar('Failed to publish session. Please try again.', 'error');
        } finally {
          setIsSubmitting(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      }
    });
  };
  
  // Show snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Close confirm dialog
  const handleCloseDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };
  
  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Session Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Session Details</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Session Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!validationErrors.title}
                      helperText={validationErrors.title}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      error={!!validationErrors.description}
                      helperText={validationErrors.description}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!validationErrors.skillId}>
                      <InputLabel id="skill-label">Select Skill</InputLabel>
                      <Select
                        labelId="skill-label"
                        id="skillId"
                        name="skillId"
                        value={formData.skillId}
                        onChange={handleChange}
                        label="Select Skill"
                        required
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                      >
                        {skills.map(skill => (
                          <MenuItem key={skill.id} value={skill.id}>
                            {skill.title} ({skill.level})
                          </MenuItem>
                        ))}
                      </Select>
                      {validationErrors.skillId && (
                        <FormHelperText>{validationErrors.skillId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!validationErrors.sessionType}>
                      <InputLabel id="session-type-label">Session Type</InputLabel>
                      <Select
                        labelId="session-type-label"
                        id="sessionType"
                        name="sessionType"
                        value={formData.sessionType}
                        onChange={handleChange}
                        label="Session Type"
                        required
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                      >
                        <MenuItem value="live">Live Session</MenuItem>
                        <MenuItem value="prerecorded">Pre-recorded Session</MenuItem>
                      </Select>
                      {validationErrors.sessionType && (
                        <FormHelperText>{validationErrors.sessionType}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!validationErrors.sessionFormat}>
                      <InputLabel id="session-format-label">Session Format</InputLabel>
                      <Select
                        labelId="session-format-label"
                        id="sessionFormat"
                        name="sessionFormat"
                        value={formData.sessionFormat}
                        onChange={handleChange}
                        label="Session Format"
                        required
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                      >
                        <MenuItem value="video">Video Call</MenuItem>
                        <MenuItem value="in_person">In-Person</MenuItem>
                        <MenuItem value="text">Text Chat</MenuItem>
                        <MenuItem value="audio">Audio Only</MenuItem>
                      </Select>
                      {validationErrors.sessionFormat && (
                        <FormHelperText>{validationErrors.sessionFormat}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Maximum Participants"
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      inputProps={{ min: 1 }}
                      error={!!validationErrors.maxParticipants}
                      helperText={validationErrors.maxParticipants || 'Set to 1 for one-on-one sessions'}
                      required
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="subtitle1" gutterBottom>Session Preview</Typography>
                <Divider sx={{ mb: 2 }} />
                
                {formData.skillImage ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={formData.skillImage}
                    alt={formData.skillTitle}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 140, 
                      bgcolor: 'grey.200', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2,
                      borderRadius: 1
                    }}
                  >
                    <ImageIcon fontSize="large" color="disabled" />
                  </Box>
                )}
                
                <Typography variant="h6" gutterBottom>
                  {formData.title || 'Your Session Title'}
                </Typography>
                
                {formData.skillTitle && (
                  <Chip 
                    label={formData.skillTitle} 
                    size="small" 
                    sx={{ mb: 1 }} 
                  />
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formData.duration} min • {formData.sessionType === 'live' ? 'Live' : 'Pre-recorded'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formData.maxParticipants} {formData.maxParticipants === 1 ? 'participant' : 'participants'} max
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {formData.description || 'A detailed description of your session will appear here.'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
        
      case 1: // Schedule
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Session Schedule</Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={addSession}
              >
                Add Session
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {formData.sessions.map((session, index) => (
                <Paper 
                  key={session.id || index} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main',
                    bgcolor: expandedSession === index ? 'action.hover' : 'background.paper',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={(e) => {
                    // Only toggle if clicking on the header area, not on form controls
                    if (!e.target.closest('.no-close')) {
                      toggleSessionExpansion(index);
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">
                        Session {index + 1}
                        {session.isRecurring && (
                          <Chip 
                            label="Recurring" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(session.date, 'EEEE, MMMM d, yyyy')} • 
                        {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSession(index);
                        }}
                        disabled={formData.sessions.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSessionExpansion(index);
                        }}
                      >
                        {expandedSession === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Collapse in={expandedSession === index} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2} sx={{ mt: 1 }} className="no-close" onClick={(e) => e.stopPropagation()}>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Date"
                          value={session.date}
                          onChange={(date) => handleSessionChange(index, 'date', date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!validationErrors[`session-${index}-date`],
                              helperText: validationErrors[`session-${index}-date`],
                              className: 'no-close',
                              onClick: (e) => e.stopPropagation()
                            },
                            popper: {
                              onClick: (e) => e.stopPropagation()
                            }
                          }}
                          className="no-close"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TimePicker
                          label="Start Time"
                          value={session.startTime}
                          onChange={(time) => handleSessionChange(index, 'startTime', time)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!validationErrors[`session-${index}-startTime`],
                              helperText: validationErrors[`session-${index}-startTime`],
                              className: 'no-close',
                              onClick: (e) => e.stopPropagation()
                            },
                            popper: {
                              onClick: (e) => e.stopPropagation()
                            }
                          }}
                          className="no-close"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <TimePicker
                          label="End Time"
                          value={session.endTime}
                          onChange={(time) => handleSessionChange(index, 'endTime', time)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!validationErrors[`session-${index}-endTime`],
                              helperText: validationErrors[`session-${index}-endTime`] || 
                                `Duration: ${Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} min`,
                              className: 'no-close',
                              onClick: (e) => e.stopPropagation()
                            },
                            popper: {
                              onClick: (e) => e.stopPropagation()
                            }
                          }}
                          className="no-close"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={session.isRecurring}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSessionChange(index, 'isRecurring', e.target.checked);
                              }}
                              color="primary"
                              className="no-close"
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                          label="This is a recurring session"
                        />
                      </Grid>
                      
                      {session.isRecurring && (
                        <>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel id={`recurring-pattern-${index}-label`}>Recurring Pattern</InputLabel>
                              <Select
                                labelId={`recurring-pattern-${index}-label`}
                                className="no-close"
                                id={`recurring-pattern-${index}`}
                                value={session.recurringPattern}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSessionChange(index, 'recurringPattern', e.target.value);
                                }}
                                label="Recurring Pattern"
                                MenuProps={{
                                  disablePortal: true,
                                  disableScrollLock: true,
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                    },
                                    onClick: (e) => e.stopPropagation()
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {['daily', 'weekly', 'biweekly', 'monthly'].map((option) => (
                                  <MenuItem 
                                    key={option} 
                                    value={option}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSessionChange(index, 'recurringPattern', option);
                                    }}
                                  >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              label="Recurring End Date"
                              value={session.recurringEndDate}
                              onChange={(date) => handleSessionChange(index, 'recurringEndDate', date)}
                              minDate={session.date}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!validationErrors[`session-${index}-recurringEndDate`],
                                  helperText: validationErrors[`session-${index}-recurringEndDate`] || 
                                    `Will repeat until ${format(session.recurringEndDate, 'MMM d, yyyy')}`
                                }
                              }}
                            />
                          </Grid>
                        </>
                      )}
                      
                      {formData.sessionFormat === 'video' || formData.sessionFormat === 'audio' ? (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Meeting Link"
                            placeholder="https://meet.google.com/..."
                            value={session.meetingLink}
                            onChange={(e) => handleSessionChange(index, 'meetingLink', e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LinkIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      ) : formData.sessionFormat === 'in_person' ? (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Location"
                            placeholder="123 Main St, City, State ZIP"
                            value={session.location}
                            onChange={(e) => handleSessionChange(index, 'location', e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOnIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      ) : null}
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Max Participants"
                          type="number"
                          value={session.maxParticipants}
                          onChange={(e) => handleSessionChange(index, 'maxParticipants', parseInt(e.target.value, 10) || 1)}
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
                </Paper>
              ))}
            </LocalizationProvider>
            
            {validationErrors.sessions && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {validationErrors.sessions}
              </Typography>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Timezone: {formData.timezone}
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  // In a real app, this would open timezone selection
                  showSnackbar('Timezone selection coming soon', 'info');
                }}
              >
                Change Timezone
              </Button>
            </Box>
          </Paper>
        );
        
      case 2: // Pricing
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Pricing</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFree}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isFree: e.target.checked,
                        price: e.target.checked ? 0 : prev.price
                      }))}
                      color="primary"
                    />
                  }
                  label="This is a free session"
                />
                
                {!formData.isFree && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Price per participant"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, step: 0.01 }
                      }}
                      error={!!validationErrors.price}
                      helperText={validationErrors.price}
                    />
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      You'll receive approximately ${(formData.price * 0.85).toFixed(2)} per participant after platform fees (15%).
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Methods
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    We support all major credit cards, PayPal, and bank transfers. You'll need to set up your payment account before receiving payouts.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      // In a real app, this would open payment settings
                      showSnackbar('Payment settings coming soon', 'info');
                    }}
                  >
                    Set Up Payments
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Pricing Summary
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Session Type" />
                      <Typography variant="body2">
                        {formData.sessionType === 'live' ? 'Live' : 'Pre-recorded'} Session
                      </Typography>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText primary="Session Format" />
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {formData.sessionFormat.replace('_', ' ')}
                      </Typography>
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText primary="Duration" />
                      <Typography variant="body2">
                        {formData.duration} minutes
                      </Typography>
                    </ListItem>
                    
                    <Divider component="li" sx={{ my: 1 }} />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Price per participant" 
                        secondary={formData.isFree ? 'Free' : `$${formData.price.toFixed(2)}`}
                      />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {formData.isFree ? 'Free' : `$${formData.price.toFixed(2)}`}
                      </Typography>
                    </ListItem>
                    
                    {!formData.isFree && (
                      <>
                        <ListItem>
                          <ListItemText 
                            primary="Platform fee (15%)" 
                            secondary="Includes payment processing"
                          />
                          <Typography variant="body2" color="text.secondary">
                            -${(formData.price * 0.15).toFixed(2)}
                          </Typography>
                        </ListItem>
                        
                        <Divider component="li" sx={{ my: 1 }} />
                        
                        <ListItem>
                          <ListItemText 
                            primary="You earn per participant" 
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                          />
                          <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            ${(formData.price * 0.85).toFixed(2)}
                          </Typography>
                        </ListItem>
                      </>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        );
        
      case 3: // Requirements & Resources
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Requirements</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Let students know what they need to prepare or have before the session.
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  {formData.requirements.map((req, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        p: 1,
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      }}
                    >
                      <CheckIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {req}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => removeRequirement(index)}
                        color="error"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a requirement (e.g., Laptop with Python installed)"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={addRequirement}
                    disabled={!newRequirement.trim()}
                  >
                    Add
                  </Button>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>Learning Outcomes</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  What will students learn or be able to do after this session?
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  {formData.learningOutcomes.map((outcome, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        p: 1,
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      }}
                    >
                      <CheckIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {outcome}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => removeOutcome(index)}
                        color="error"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a learning outcome (e.g., Understand the basics of React hooks)"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addOutcome()}
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={addOutcome}
                    disabled={!newOutcome.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Resources</Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Add helpful resources for your students (links, files, or text).
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {formData.resources.map((resource) => (
                    <Card key={resource.id} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 1.5, pb: 1, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {resource.type === 'link' ? (
                            <LinkIcon color="primary" sx={{ mr: 1 }} />
                          ) : resource.type === 'file' ? (
                            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                          ) : resource.type === 'video' ? (
                            <VideocamIcon color="primary" sx={{ mr: 1 }} />
                          ) : (
                            <ArticleIcon color="primary" sx={{ mr: 1 }} />
                          )}
                          
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                              {resource.title || 'Untitled Resource'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {resource.type === 'link' ? resource.url : resource.type}
                            </Typography>
                          </Box>
                          
                          <IconButton 
                            size="small" 
                            onClick={() => removeResource(resource.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                
                <Box>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="resource-type-label">Resource Type</InputLabel>
                    <Select
                      labelId="resource-type-label"
                      id="resource-type"
                      value={newResource.type}
                      onChange={(e) => {
                        e.stopPropagation();
                        setNewResource(prev => ({
                          ...prev,
                          type: e.target.value,
                          url: '' // Reset URL when type changes
                        }));
                      }}
                      label="Resource Type"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                        onClick: (e) => {
                          e.stopPropagation();
                          setNewResource(prev => ({
                            ...prev,
                            type: e.target.value,
                            url: '' // Reset URL when type changes
                          }));
                        }
                      }}
                    >
                      {['link', 'file', 'text'].map((type) => (
                        <MenuItem 
                          key={type} 
                          value={type}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewResource(prev => ({
                              ...prev,
                              type,
                              url: '' // Reset URL when type changes
                            }));
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    size="small"
                    label={newResource.type === 'text' ? 'Content' : 'Title'}
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    sx={{ mb: 2 }}
                  />
                  
                  {newResource.type !== 'text' && (
                    <TextField
                      fullWidth
                      size="small"
                      label={newResource.type === 'link' ? 'URL' : 'Description'}
                      value={newResource.url}
                      onChange={(e) => setNewResource(prev => ({
                        ...prev,
                        url: e.target.value
                      }))}
                      placeholder={
                        newResource.type === 'link' 
                          ? 'https://example.com/resource' 
                          : 'A brief description of the resource'
                      }
                      sx={{ mb: 2 }}
                    />
                  )}
                  
                  {newResource.type === 'file' && (
                    <Button 
                      variant="outlined" 
                      component="label"
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Upload File
                      <input 
                        type="file" 
                        hidden 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewResource(prev => ({
                              ...prev,
                              title: file.name,
                              url: URL.createObjectURL(file)
                            }));
                          }
                        }}
                      />
                    </Button>
                  )}
                  
                  <Button 
                    variant="contained" 
                    onClick={addResource}
                    disabled={!newResource.title.trim() || (newResource.type !== 'text' && !newResource.url.trim())}
                    fullWidth
                  >
                    Add Resource
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
        
      case 4: // Review & Publish
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Review Your Session</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review all the details before publishing your session.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                    Session Details
                  </Typography>
                  
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="h6" gutterBottom>{formData.title}</Typography>
                    <Typography variant="body1" paragraph>{formData.description}</Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip 
                        label={formData.skillTitle} 
                        size="small" 
                        icon={<SchoolIcon />} 
                        variant="outlined"
                      />
                      <Chip 
                        label={formData.skillLevel} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={formData.skillCategory} 
                        size="small" 
                        variant="outlined"
                        icon={<CategoryIcon />}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formData.duration} min • {formData.sessionType === 'live' ? 'Live' : 'Pre-recorded'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formData.maxParticipants} {formData.maxParticipants === 1 ? 'participant' : 'participants'} max
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {formData.isFree ? (
                          <>
                            <AttachMoneyIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="success.main">
                              Free
                            </Typography>
                          </>
                        ) : (
                          <>
                            <AttachMoneyIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="primary">
                              ${formData.price.toFixed(2)} per participant
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                    Schedule
                  </Typography>
                  
                  <Box sx={{ pl: 4 }}>
                    {formData.sessions.map((session, index) => (
                      <Paper 
                        key={index} 
                        variant="outlined" 
                        sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle2">Session {index + 1}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(session.date, 'EEEE, MMMM d, yyyy')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')} • {formData.timezone}
                            </Typography>
                            
                            {session.isRecurring && (
                              <Typography variant="caption" color="primary" display="block" sx={{ mt: 1 }}>
                                Repeats {session.recurringPattern} until {format(session.recurringEndDate, 'MMM d, yyyy')}
                              </Typography>
                            )}
                          </Box>
                          
                          {formData.sessionFormat === 'video' || formData.sessionFormat === 'audio' ? (
                            <Chip 
                              icon={<VideocamIcon />} 
                              label={formData.sessionFormat === 'video' ? 'Video Call' : 'Audio Call'}
                              size="small"
                              variant="outlined"
                            />
                          ) : formData.sessionFormat === 'in_person' ? (
                            <Chip 
                              icon={<LocationOnIcon />} 
                              label="In-Person"
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Chip 
                              icon={<ArticleIcon />} 
                              label="Text Chat"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        {(session.meetingLink || session.location) && (
                          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                            {session.meetingLink && (
                              <Typography variant="caption" display="block" noWrap>
                                <LinkIcon fontSize="inherit" color="primary" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                <a 
                                  href={session.meetingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{ color: 'inherit' }}
                                >
                                  {session.meetingLink.length > 40 
                                    ? session.meetingLink.substring(0, 40) + '...' 
                                    : session.meetingLink}
                                </a>
                              </Typography>
                            )}
                            
                            {session.location && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                <LocationOnIcon fontSize="inherit" color="primary" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                {session.location}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                </Box>
                
                {(formData.requirements.length > 0 || formData.learningOutcomes.length > 0) && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} />
                      Requirements & Learning Outcomes
                    </Typography>
                    
                    <Box sx={{ pl: 4 }}>
                      {formData.requirements.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>Requirements</Typography>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {formData.requirements.map((req, index) => (
                              <li key={index}>
                                <Typography variant="body2">{req}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                      
                      {formData.learningOutcomes.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>What You'll Learn</Typography>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {formData.learningOutcomes.map((outcome, index) => (
                              <li key={index}>
                                <Typography variant="body2">{outcome}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                
                {formData.resources.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinkIcon color="primary" sx={{ mr: 1 }} />
                      Resources
                    </Typography>
                    
                    <Box sx={{ pl: 4 }}>
                      <Grid container spacing={1}>
                        {formData.resources.map((resource, index) => (
                          <Grid item xs={12} sm={6} key={resource.id}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {resource.type === 'link' ? (
                                    <LinkIcon color="primary" sx={{ mr: 1 }} />
                                  ) : resource.type === 'file' ? (
                                    <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                                  ) : resource.type === 'video' ? (
                                    <VideocamIcon color="primary" sx={{ mr: 1 }} />
                                  ) : (
                                    <ArticleIcon color="primary" sx={{ mr: 1 }} />
                                  )}
                                  
                                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" noWrap>
                                      {resource.title || 'Untitled Resource'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                                      {resource.type === 'link' ? resource.url : resource.type}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, position: 'sticky', top: 20 }}>
                  <Typography variant="subtitle1" gutterBottom>Publishing Options</Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          isPublished: e.target.checked
                        }))}
                        color="primary"
                      />
                    }
                    label="Publish immediately"
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {formData.isPublished 
                      ? 'Your session will be visible to students after you publish it.'
                      : 'Save as draft to finish later. Your session will not be visible to students.'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={publishSession}
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                    >
                      {formData.isPublished ? 'Publish Session' : 'Save as Draft'}
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      fullWidth
                      onClick={saveAsDraft}
                      disabled={isSubmitting}
                      startIcon={<SaveIcon />}
                    >
                      Save & Exit
                    </Button>
                    
                    <Button 
                      variant="text" 
                      color="error" 
                      fullWidth
                      onClick={() => {
                        setConfirmDialog({
                          open: true,
                          title: 'Discard Changes',
                          content: 'Are you sure you want to discard all changes?',
                          action: () => navigate('/teach')
                        });
                      }}
                      disabled={isSubmitting}
                    >
                      Discard
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        );
        
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ mr: 2 }}
            disabled={isSubmitting}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {id ? 'Edit Session' : 'Create New Session'}
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{!isMobile && label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            <Box>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                >
                  {formData.isPublished ? 'Publish Session' : 'Save as Draft'}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Box>
      
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
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (confirmDialog.action) confirmDialog.action();
              else handleCloseDialog();
            }} 
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateSession;
