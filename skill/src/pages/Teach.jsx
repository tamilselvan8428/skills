import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Box, 
  Chip, 
  Paper,
  TextField,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { skillsApi, usersApi, sessionsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Teach = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both skills and sessions in parallel
        const [skillsRes, sessionsRes] = await Promise.all([
          skillsApi.list(),
          sessionsApi.mine()
        ]);
        setSkills(skillsRes.data);
        setSessions(sessionsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      setSubmitting(true);
      await skillsApi.add({ skillName: newSkill.trim() });
      setNewSkill('');
      // Refresh skills list
      const response = await skillsApi.list();
      setSkills(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Teach on SkillSwap
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share your knowledge and help others learn new skills
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Add New Skill Form */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Add a New Skill to Teach
            </Typography>
            <Box component="form" onSubmit={handleAddSkill} sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                label="Skill Name"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., JavaScript, Photography, Cooking"
                disabled={submitting}
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={submitting || !newSkill.trim()}
                size="small"
              >
                Add
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Teaching Sessions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sessions.length} upcoming session{sessions.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-session')}
                size="small"
              >
                New Session
              </Button>
            </Box>
            
            {/* Sessions List */}
            {sessions.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {sessions.map((session) => (
                  <Paper 
                    key={session._id} 
                    sx={{ 
                      p: 2, 
                      mb: 1, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
                    }}
                    onClick={() => navigate(`/sessions/${session._id}`)}
                  >
                    <Box>
                      <Typography variant="subtitle1">{session.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(session.scheduledTime).toLocaleString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={session.status || 'upcoming'} 
                      color={session.status === 'completed' ? 'success' : 'primary'} 
                      size="small"
                    />
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                No upcoming sessions. Create your first session!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Skills Grid */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, mt: 4 }}>
        Available Skills
      </Typography>
      
      {skills.length > 0 ? (
        <Grid container spacing={3}>
          {skills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h3">
                      {skill.skillName}
                    </Typography>
                  </Box>
                  
                  {skill.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {skill.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<PeopleIcon />}
                      label={`${skill.usersTeaching?.length || 0} Teaching`}
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      icon={<PeopleIcon />}
                      label={`${skill.usersLearning?.length || 0} Learning`}
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/skills/${skill._id}`)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No skills available yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to add a skill to our platform!
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Teach;
