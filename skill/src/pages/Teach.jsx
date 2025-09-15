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
import { skillsApi, usersApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Teach = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillsApi.list();
        setSkills(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
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
      <Paper sx={{ p: 3, mb: 4 }}>
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
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={submitting || !newSkill.trim()}
          >
            Add Skill
          </Button>
        </Box>
      </Paper>

      {/* Skills Grid */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
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
