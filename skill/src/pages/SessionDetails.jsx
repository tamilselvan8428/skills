import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Box, 
  Chip, 
  Divider, 
  Avatar, 
  IconButton, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Rating,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  LocationOn as LocationOnIcon,
  Link as LinkIcon,
  Videocam as VideocamIcon,
  School as SchoolIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [session, setSession] = useState(null);
  const [relatedSessions, setRelatedSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', content: '', action: null });
  const [expandedSession, setExpandedSession] = useState(0);
  
  // Mock data for session
  const mockSession = {
    id: '1',
    title: 'React Hooks Masterclass',
    description: 'Learn how to use React Hooks to build modern React applications. This session will cover useState, useEffect, useContext, useReducer, and custom hooks.',
    instructor: {
      id: '1',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: 'Senior Frontend Developer',
      rating: 4.8,
      totalStudents: 1245,
      totalSessions: 42
    },
    skill: {
      id: '1',
      title: 'React',
      level: 'Intermediate',
      category: 'Web Development',
      image: 'https://source.unsplash.com/random/400x225/?react'
    },
    sessions: [
      {
        id: 's1',
        date: new Date('2023-06-15'),
        startTime: new Date('2023-06-15T10:00:00'),
        endTime: new Date('2023-06-15T11:30:00'),
        meetingLink: 'https://meet.google.com/abc-xyz-123',
        location: 'Online',
        maxParticipants: 20,
        enrolled: 15,
        isRecurring: false
      },
      {
        id: 's2',
        date: new Date('2023-06-16'),
        startTime: new Date('2023-06-16T14:00:00'),
        endTime: new Date('2023-06-16T15:30:00'),
        meetingLink: 'https://meet.google.com/abc-xyz-124',
        location: 'Online',
        maxParticipants: 20,
        enrolled: 8,
        isRecurring: false
      }
    ],
    requirements: [
      'Basic understanding of JavaScript',
      'Node.js installed',
      'Code editor (VS Code recommended)'
    ],
    learningOutcomes: [
      'Understand React Hooks fundamentals',
      'Build custom hooks',
      'Manage state with useReducer',
      'Use Context API with hooks'
    ],
    resources: [
      {
        id: 'r1',
        type: 'link',
        title: 'React Hooks Documentation',
        url: 'https://reactjs.org/docs/hooks-intro.html'
      },
      {
        id: 'r2',
        type: 'file',
        title: 'Session Slides',
        url: '/downloads/react-hooks-slides.pdf'
      }
    ],
    price: 29.99,
    isFree: false,
    duration: 90, // in minutes
    totalEnrolled: 124,
    averageRating: 4.7,
    totalReviews: 24,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z',
    isEnrolled: false,
    isCompleted: false
  };
  
  // Mock related sessions
  const mockRelatedSessions = [
    {
      id: '2',
      title: 'Advanced React Patterns',
      instructor: 'John Doe',
      date: '2023-06-20',
      time: '14:00 - 15:30',
      price: 39.99,
      enrolled: 18,
      maxParticipants: 20,
      image: 'https://source.unsplash.com/random/400x225/?react,code'
    },
    {
      id: '3',
      title: 'State Management with Redux',
      instructor: 'Sarah Johnson',
      date: '2023-06-22',
      time: '11:00 - 12:30',
      price: 34.99,
      enrolled: 12,
      maxParticipants: 20,
      image: 'https://source.unsplash.com/random/400x225/?redux'
    }
  ];
  
  // Mock reviews
  const mockReviews = [
    {
      id: 'rev1',
      user: {
        id: 'u1',
        name: 'Alex Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      rating: 5,
      comment: 'Great session! The instructor was very knowledgeable and explained everything clearly.',
      date: '2023-05-15T14:30:00Z',
      isHelpful: true,
      helpfulCount: 8
    },
    {
      id: 'rev2',
      user: {
        id: 'u2',
        name: 'Maria Garcia',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
      },
      rating: 4,
      comment: 'Good content, but would love more hands-on exercises.',
      date: '2023-05-10T09:15:00Z',
      isHelpful: false,
      helpfulCount: 3
    }
  ];
  
  // Load session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // In a real app, fetch session data from API
        // const response = await api.get(`/api/sessions/${id}`);
        // setSession(response.data);
        
        // Mock data for now
        setSession(mockSession);
        setRelatedSessions(mockRelatedSessions);
        setReviews(mockReviews);
        
        // Check if user has already enrolled
        if (currentUser) {
          // In a real app, check enrollment status from API
          // const enrollmentStatus = await api.get(`/api/sessions/${id}/enrollment`);
          // setIsEnrolled(enrollmentStatus.isEnrolled);
          // setIsCompleted(enrollmentStatus.isCompleted);
          // setIsBookmarked(enrollmentStatus.isBookmarked);
          
          // Check if user has already rated
          // const userRating = await api.get(`/api/sessions/${id}/my-rating`);
          // if (userRating) {
          //   setRating(userRating.rating);
          //   setReview(userRating.comment);
          // }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        showSnackbar('Failed to load session details', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
  }, [id, currentUser]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle enrollment
  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/sessions/${id}` } });
      return;
    }
    
    setIsEnrolling(true);
    
    try {
      // In a real app, enroll user via API
      // await api.post(`/api/sessions/${id}/enroll`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSession(prev => ({
        ...prev,
        isEnrolled: true,
        totalEnrolled: prev.totalEnrolled + 1
      }));
      
      showSnackbar('Successfully enrolled in the session!', 'success');
    } catch (error) {
      console.error('Error enrolling in session:', error);
      showSnackbar('Failed to enroll in session', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };
  
  // Handle bookmark toggle
  const toggleBookmark = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/sessions/${id}` } });
      return;
    }
    
    try {
      // In a real app, toggle bookmark via API
      // await api.post(`/api/sessions/${id}/bookmark`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setIsBookmarked(!isBookmarked);
      showSnackbar(
        !isBookmarked ? 'Added to saved sessions' : 'Removed from saved sessions',
        'success'
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      showSnackbar('Failed to update bookmark', 'error');
    }
  };
  
  // Handle rating submission
  const handleRateSession = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/sessions/${id}` } });
      return;
    }
    
    if (rating === 0) {
      showSnackbar('Please select a rating', 'error');
      return;
    }
    
    try {
      // In a real app, submit rating via API
      // await api.post(`/api/sessions/${id}/rate`, { rating, comment: review });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const newReview = {
        id: `rev${reviews.length + 1}`,
        user: {
          id: currentUser.uid,
          name: currentUser.displayName || 'You',
          avatar: currentUser.photoURL || ''
        },
        rating,
        comment: review,
        date: new Date().toISOString(),
        isHelpful: false,
        helpfulCount: 0
      };
      
      setReviews([newReview, ...reviews]);
      
      // Update session rating
      if (session) {
        const newTotalRating = session.averageRating * session.totalReviews + rating;
        const newAverageRating = (newTotalRating) / (session.totalReviews + 1);
        
        setSession(prev => ({
          ...prev,
          averageRating: parseFloat(newAverageRating.toFixed(1)),
          totalReviews: prev.totalReviews + 1
        }));
      }
      
      // Reset form
      setRating(0);
      setReview('');
      setIsRating(false);
      
      showSnackbar('Thank you for your review!', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      showSnackbar('Failed to submit review', 'error');
    }
  };
  
  // Handle session join
  const handleJoinSession = (sessionId) => {
    // In a real app, this would redirect to the meeting URL or show meeting details
    const selectedSession = session.sessions.find(s => s.id === sessionId);
    if (selectedSession) {
      window.open(selectedSession.meetingLink, '_blank');
    }
  };
  
  // Show snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Toggle session expansion
  const toggleSessionExpansion = (index) => {
    setExpandedSession(expandedSession === index ? -1 : index);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  // Format time
  const formatTime = (timeString) => {
    return format(new Date(timeString), 'h:mm a');
  };
  
  // Check if session is upcoming
  const isUpcoming = (sessionDate, sessionTime) => {
    const now = new Date();
    const sessionDateTime = new Date(`${sessionDate}T${sessionTime}`);
    return isAfter(sessionDateTime, now);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Session not found
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2, mb: 4 }}>
          The session you're looking for doesn't exist or has been removed.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 6 }}>
        <Container maxWidth="lg">
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ color: 'primary.contrastText', mb: 2 }}
          >
            Back
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            {session.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={session.instructor.avatar} 
                alt={session.instructor.name}
                sx={{ width: 40, height: 40, mr: 1 }}
              />
              <Typography variant="body1">
                <strong>Instructor:</strong> {session.instructor.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Rating 
                value={session.instructor.rating} 
                precision={0.1} 
                readOnly 
                size="small"
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {session.instructor.rating.toFixed(1)} ({session.instructor.totalStudents} students)
              </Typography>
            </Box>
            
            <Chip 
              label={session.skill.title} 
              size="small" 
              variant="outlined"
              sx={{ 
                color: 'primary.contrastText', 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                ml: 'auto'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {session.sessions.length} {session.sessions.length === 1 ? 'Session' : 'Sessions'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {session.duration} minutes
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {session.totalEnrolled} enrolled
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon fontSize="small" sx={{ mr: 0.5, color: 'gold' }} />
              <Typography variant="body2">
                {session.averageRating.toFixed(1)} ({session.totalReviews} reviews)
              </Typography>
            </Box>
            
            <Box sx={{ ml: 'auto' }}>
              <IconButton 
                onClick={toggleBookmark}
                color="inherit"
                aria-label={isBookmarked ? 'Remove from saved' : 'Save for later'}
              >
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
              
              <IconButton 
                color="inherit"
                aria-label="Share"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showSnackbar('Link copied to clipboard!', 'success');
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
              >
                <Tab label="Overview" />
                <Tab label="Sessions" />
                <Tab label="Instructor" />
                <Tab label="Reviews" />
              </Tabs>
              
              <Divider sx={{ mb: 3 }} />
              
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>About This Session</Typography>
                  <Typography variant="body1" paragraph>
                    {session.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>What You'll Learn</Typography>
                  <List dense>
                    {session.learningOutcomes.map((outcome, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <CheckCircleIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <ListItemText primary={outcome} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Requirements</Typography>
                  <List dense>
                    {session.requirements.map((requirement, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <CheckCircleIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <ListItemText primary={requirement} />
                      </ListItem>
                    ))}
                  </List>
                  
                  {session.resources.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Resources</Typography>
                      <List>
                        {session.resources.map((resource) => (
                          <ListItem 
                            key={resource.id} 
                            button 
                            component="a" 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ 
                              borderRadius: 1,
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <ListItemAvatar>
                              {resource.type === 'link' ? (
                                <LinkIcon color="primary" />
                              ) : resource.type === 'file' ? (
                                <DescriptionIcon color="primary" />
                              ) : (
                                <VideocamIcon color="primary" />
                              )}
                            </ListItemAvatar>
                            <ListItemText 
                              primary={resource.title}
                              secondary={resource.type === 'link' ? resource.url : resource.type}
                              secondaryTypographyProps={{ noWrap: true }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Session Schedule</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Please select a session to join or view details.
                  </Typography>
                  
                  {session.sessions.map((sess, index) => (
                    <Paper 
                      key={sess.id} 
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
                      onClick={() => toggleSessionExpansion(index)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">
                            Session {index + 1}
                            {sess.isRecurring && (
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
                            {formatDate(sess.date)} • {formatTime(sess.startTime)} - {formatTime(sess.endTime)}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <PeopleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {sess.enrolled} / {sess.maxParticipants} participants
                            </Typography>
                            
                            {sess.enrolled >= sess.maxParticipants && (
                              <Chip 
                                label="Full" 
                                size="small" 
                                color="error" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                            
                            {isUpcoming(sess.date, sess.startTime) && sess.enrolled < sess.maxParticipants && (
                              <Chip 
                                label="Open" 
                                size="small" 
                                color="success" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                            
                            {!isUpcoming(sess.date, sess.startTime) && (
                              <Chip 
                                label="Completed" 
                                size="small" 
                                color="default" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </Box>
                        
                        <Box>
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
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                              Session Details
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {formatDate(sess.date)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {formatTime(sess.startTime)} - {formatTime(sess.endTime)} ({session.duration} min)
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {sess.enrolled} / {sess.maxParticipants} participants
                              </Typography>
                            </Box>
                            
                            {sess.location && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {sess.location}
                                </Typography>
                              </Box>
                            )}
                            
                            {sess.meetingLink && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <VideocamIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  <a 
                                    href={sess.meetingLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: 'inherit' }}
                                  >
                                    Join Meeting
                                  </a>
                                </Typography>
                              </Box>
                            )}
                            
                            {session.isEnrolled ? (
                              isUpcoming(sess.date, sess.startTime) ? (
                                <Button 
                                  variant="contained" 
                                  color="primary" 
                                  fullWidth
                                  onClick={() => handleJoinSession(sess.id)}
                                  startIcon={<VideocamIcon />}
                                  sx={{ mt: 1 }}
                                >
                                  Join Session
                                </Button>
                              ) : (
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  fullWidth
                                  disabled
                                  startIcon={<EventBusyIcon />}
                                  sx={{ mt: 1 }}
                                >
                                  Session Completed
                                </Button>
                              )
                            ) : (
                              <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                onClick={handleEnroll}
                                disabled={sess.enrolled >= sess.maxParticipants}
                                startIcon={isEnrolling ? <CircularProgress size={20} /> : <EventAvailableIcon />}
                                sx={{ mt: 1 }}
                              >
                                {sess.enrolled >= sess.maxParticipants ? 'Session Full' : 'Enroll Now'}
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </Collapse>
                    </Paper>
                  ))}
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      src={session.instructor.avatar} 
                      alt={session.instructor.name}
                      sx={{ width: 80, height: 80, mr: 3 }}
                    />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {session.instructor.name}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {session.instructor.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={session.instructor.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small"
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {session.instructor.rating.toFixed(1)} ({session.instructor.totalStudents} students)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>About the Instructor</Typography>
                  <Typography variant="body1" paragraph>
                    {session.instructor.name} is a {session.instructor.title.toLowerCase()} with over 5 years of experience in the field. 
                    They have taught {session.instructor.totalStudents} students across {session.instructor.totalSessions} sessions 
                    and have an average rating of {session.instructor.rating.toFixed(1)} out of 5.
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    Their teaching methodology focuses on hands-on learning and real-world applications. 
                    They believe in creating an interactive and engaging learning environment where 
                    students can ask questions and collaborate with peers.
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate(`/instructors/${session.instructor.id}`)}
                    sx={{ mt: 2 }}
                  >
                    View Full Profile
                  </Button>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Other Sessions by {session.instructor.name.split(' ')[0]}</Typography>
                  <Grid container spacing={2}>
                    {relatedSessions.map((related) => (
                      <Grid item xs={12} sm={6} key={related.id}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="120"
                            image={related.image}
                            alt={related.title}
                          />
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom noWrap>
                              {related.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {related.date} • {related.time}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {related.enrolled} / {related.maxParticipants} enrolled
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="h6" color="primary">
                                ${related.price}
                              </Typography>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => navigate(`/sessions/${related.id}`)}
                              >
                                View Details
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {tabValue === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" component="span">
                        {session.averageRating.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                        out of 5 ({session.totalReviews} reviews)
                      </Typography>
                    </Box>
                    
                    {!isRating && (
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => setIsRating(true)}
                        disabled={!session.isEnrolled}
                      >
                        Write a Review
                      </Button>
                    )}
                  </Box>
                  
                  {isRating && (
                    <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Write a Review
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography component="legend">Your Rating</Typography>
                        <Rating
                          name="session-rating"
                          value={rating}
                          onChange={(event, newValue) => setRating(newValue)}
                          precision={0.5}
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />
                      </Box>
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        label="Your Review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this session..."
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => {
                            setIsRating(false);
                            setRating(0);
                            setReview('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={handleRateSession}
                          disabled={!rating}
                        >
                          Submit Review
                        </Button>
                      </Box>
                    </Paper>
                  )}
                  
                  <List>
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <React.Fragment key={rev.id}>
                          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar 
                                src={rev.user.avatar} 
                                alt={rev.user.name}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                  <Typography variant="subtitle2">
                                    {rev.user.name}
                                  </Typography>
                                  <Rating 
                                    value={rev.rating} 
                                    precision={0.5} 
                                    readOnly 
                                    size="small"
                                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {formatDate(rev.date)}
                                  </Typography>
                                  <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                                    {rev.comment}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton size="small" color={rev.isHelpful ? 'primary' : 'default'}>
                                      <ThumbUpIcon fontSize="small" />
                                    </IconButton>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                                      {rev.helpfulCount} people found this helpful
                                    </Typography>
                                    <Button size="small" color="primary">
                                      Report
                                    </Button>
                                  </Box>
                                </>
                              }
                            />
                          </ListItem>
                          <Divider component="li" sx={{ my: 1 }} />
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <MessageIcon color="action" sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                        <Typography variant="body1" color="text.secondary">
                          No reviews yet. Be the first to review this session!
                        </Typography>
                      </Box>
                    )}
                  </List>
                </Box>
              )}
            </Paper>
            
            {/* Related Sessions */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
              You May Also Like
            </Typography>
            
            <Grid container spacing={3}>
              {relatedSessions.map((related) => (
                <Grid item xs={12} sm={6} md={6} key={related.id}>
                  <Card sx={{ display: 'flex', height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, display: { xs: 'none', sm: 'block' } }}
                      image={related.image}
                      alt={related.title}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                        <Typography component="div" variant="subtitle1" noWrap>
                          {related.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {related.instructor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: 14 }} />
                          <Typography variant="caption" color="text.secondary">
                            {related.date} • {related.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: 14 }} />
                          <Typography variant="caption" color="text.secondary">
                            {related.enrolled} enrolled
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 1, pt: 0, justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="primary">
                          ${related.price}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/sessions/${related.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Session Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {session.skill.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={session.skill.image}
                    alt={session.title}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {session.sessions.length} {session.sessions.length === 1 ? 'Session' : 'Sessions'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {session.duration} minutes
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {session.totalEnrolled} enrolled
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <StarIcon fontSize="small" sx={{ color: 'gold', mr: 0.5 }} />
                  <Typography variant="body2">
                    {session.averageRating.toFixed(1)} ({session.totalReviews} reviews)
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {session.isFree ? 'Free' : `$${session.price.toFixed(2)}`}
                  </Typography>
                  
                  {!session.isFree && (
                    <Typography variant="body2" color="text.secondary">
                      ${(session.price * 0.85).toFixed(2)} after fees
                    </Typography>
                  )}
                </Box>
                
                {session.isEnrolled ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    size="large"
                    onClick={() => handleJoinSession(session.sessions[0]?.id)}
                    disabled={!isUpcoming(session.sessions[0]?.date, session.sessions[0]?.startTime)}
                    startIcon={<VideocamIcon />}
                    sx={{ mb: 1 }}
                  >
                    Join Session
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    size="large"
                    onClick={handleEnroll}
                    disabled={session.sessions.every(s => s.enrolled >= s.maxParticipants)}
                    startIcon={isEnrolling ? <CircularProgress size={20} /> : <EventAvailableIcon />}
                    sx={{ mb: 1 }}
                  >
                    {session.sessions.every(s => s.enrolled >= s.maxParticipants) 
                      ? 'All Sessions Full' 
                      : 'Enroll Now'}
                  </Button>
                )}
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large"
                  onClick={toggleBookmark}
                  startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  sx={{ mb: 2 }}
                >
                  {isBookmarked ? 'Saved' : 'Save for Later'}
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    30-day money-back guarantee
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Share this session
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<span>f</span>}
                    fullWidth
                    onClick={() => {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                        '_blank'
                      );
                    }}
                  >
                    Facebook
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<span>t</span>}
                    fullWidth
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(session.title)}`,
                        '_blank'
                      );
                    }}
                  >
                    Twitter
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<span>in</span>}
                    fullWidth
                    onClick={() => {
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                        '_blank'
                      );
                    }}
                  >
                    LinkedIn
                  </Button>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={window.location.href}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              showSnackbar('Link copied to clipboard!', 'success');
                            }}
                            edge="end"
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Paper>
            
            {/* Support */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Need help?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our support team is here to help with any questions about this session.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                fullWidth
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Snackbar for notifications */}
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
    </Box>
  );
};

export default SessionDetails;
