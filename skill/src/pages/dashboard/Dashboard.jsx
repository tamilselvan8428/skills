import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Tabs, Tab, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { VideoLibrary, School, Bookmark, Notifications } from '@mui/icons-material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { motion } from 'framer-motion';
import { sessionsApi, usersApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [teachingSessions, setTeachingSessions] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New session on Data Science available', time: '2 hours ago', read: false },
    { id: 2, message: 'Your session on React Hooks is tomorrow', time: '1 day ago', read: true },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const [sessionsRes, recsRes] = await Promise.all([
          sessionsApi.mine(),
          usersApi.getRecordings()
        ]);
        const sessions = sessionsRes.data || [];
        setTeachingSessions(sessions.filter(s => s.teacher));
        setUpcomingSessions(sessions);
        const recs = recsRes.data || [];
        setRecordedSessions(recs.map(r => ({
          id: r._id,
          title: r.sessionId?.title || 'Recording',
          duration: 'N/A',
          teacher: r.sessionId?.teacher?.name || 'Unknown',
          skill: r.sessionId?.title || 'Session',
          views: 0
        })));
      } catch (e) {
        // non-blocking UI
      }
    };
    load();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/sessions/create')}>
          Schedule a Session
        </Button>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        aria-label="dashboard tabs"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<VideoLibrary />} label="My Learning" />
        <Tab icon={<School />} label="My Teaching" />
        <Tab icon={<Bookmark />} label="Saved Sessions" />
        <Tab 
          icon={
            <Box sx={{ position: 'relative' }}>
              <Notifications />
              {notifications.some(n => !n.read) && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    width: 12,
                    height: 12,
                    bgcolor: 'error.main',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Box>
          } 
          label="Notifications" 
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Upcoming Sessions</Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <Grid item xs={12} sm={6} md={4} key={session.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyledCard>
                    <CardContent>
                      <Chip 
                        label={session.skill} 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" component="h3" gutterBottom>
                        {session.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                          {session.teacher.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {session.teacher}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(session.date)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto', p: 2 }}>
                      <Button size="small" color="primary" variant="outlined" fullWidth>
                        Join Session
                      </Button>
                    </CardActions>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No upcoming sessions. Browse skills to join a session!
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Browse Skills
              </Button>
            </Box>
          )}
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Recorded Sessions</Typography>
        <Grid container spacing={3}>
          {recordedSessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session.id}>
              <StyledCard>
                <Box 
                  sx={{
                    height: 140,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                  <Chip 
                    label={session.duration}
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white'
                    }}
                  />
                </Box>
                <CardContent>
                  <Chip 
                    label={session.skill} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {session.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {session.teacher}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.views} views
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button size="small" color="primary">
                    Watch Now
                  </Button>
                  <Button size="small" color="inherit">
                    Save for Later
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Your Teaching Sessions</Typography>
        <Grid container spacing={3}>
          {teachingSessions.length > 0 ? (
            teachingSessions.map((session) => (
              <Grid item xs={12} md={6} key={session.id}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip 
                        label={session.skill} 
                        color="secondary" 
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {session.students} {session.students === 1 ? 'student' : 'students'} enrolled
                      </Typography>
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {session.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formatDate(session.date)}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained">
                        Start Session
                      </Button>
                      <Button size="small" variant="outlined">
                        Edit
                      </Button>
                      <Button size="small" color="error">
                        Cancel
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                You're not teaching any sessions yet.
              </Typography>
              <Button variant="contained" color="primary">
                Create a Session
              </Button>
            </Box>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Saved Sessions</Typography>
        {recordedSessions.length > 0 ? (
          <Grid container spacing={3}>
            {recordedSessions.map((session) => (
              <Grid item xs={12} sm={6} md={4} key={session.id}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {session.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {session.teacher} • {session.skill}
                    </Typography>
                    <Button size="small" variant="outlined" fullWidth>
                      Continue Watching
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You haven't saved any sessions yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Save interesting sessions to watch them later.
            </Typography>
            <Button variant="contained" color="primary">
              Browse Sessions
            </Button>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Notifications</Typography>
        {notifications.length > 0 ? (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {notifications.map((notification) => (
              <Box 
                key={notification.id} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  bgcolor: notification.read ? 'background.paper' : 'action.selected',
                  borderRadius: 1,
                  borderLeft: `3px solid ${notification.read ? 'transparent' : 'primary.main'}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No new notifications.
            </Typography>
          </Box>
        )}
      </TabPanel>
    </Container>
  );
};

export default Dashboard;
