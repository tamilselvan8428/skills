import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Divider, 
  Avatar, 
  Tabs, 
  Tab, 
  Paper,
  IconButton,
  Alert
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  PlayCircleOutline as PlayIcon,
  ArticleOutlined as ArticleIcon,
  QuizOutlined as QuizIcon,
  CodeOutlined as CodeIcon,
  School as SchoolIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { skillsApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedSkills, setRelatedSkills] = useState([]);
  
  // Fetch skill details
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const response = await skillsApi.list();
        const foundSkill = response.data.find(s => s._id === id);
        if (foundSkill) {
          setSkill(foundSkill);
          // Get related skills (other skills with similar names)
          const related = response.data
            .filter(s => s._id !== id && s.skillName.toLowerCase().includes(foundSkill.skillName.toLowerCase().split(' ')[0]))
            .slice(0, 4);
          setRelatedSkills(related);
        } else {
          setError('Skill not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skill');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: skill?.skillName,
        text: `Check out this skill: ${skill?.skillName}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await skillsApi.expressInterest(id);
      // Refresh skill data
      const response = await skillsApi.list();
      const updatedSkill = response.data.find(s => s._id === id);
      setSkill(updatedSkill);
    } catch (err) {
      console.error('Failed to express interest:', err);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );
  if (!skill) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="warning">Skill not found</Alert>
    </Container>
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {skill.skillName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                  <Chip 
                    icon={<PeopleIcon />}
                    label={`${skill.usersTeaching?.length || 0} Teaching`}
                    color="primary" 
                    size="small" 
                    variant="outlined"
                  />
                  <Chip 
                    icon={<PeopleIcon />}
                    label={`${skill.usersLearning?.length || 0} Learning`}
                    color="secondary" 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                  {skill.description || 'No description available'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={toggleBookmark} color="primary">
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
            
            {/* Skill Info */}
            <Box 
              sx={{
                height: 200,
                width: '100%',
                backgroundColor: 'action.hover',
                borderRadius: 2,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
            </Box>
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="skill details tabs"
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Community" value="community" />
              </Tabs>
            </Box>
            
            {/* Tab Content */}
            <Box sx={{ minHeight: 300 }}>
              {tabValue === 'overview' && (
                <div>
                  <Typography variant="h6" gutterBottom>About This Skill</Typography>
                  <Typography paragraph>
                    {skill.description || 'This skill is available for learning and teaching in our community. Join others who are interested in mastering this skill.'}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Skill Statistics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PeopleIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography>{skill.usersTeaching?.length || 0} people are teaching this skill</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon color="secondary" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography>{skill.usersLearning?.length || 0} people are learning this skill</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              )}
              
              {tabValue === 'community' && (
                <div>
                  <Typography variant="h6" gutterBottom>Community Activity</Typography>
                  <Typography paragraph>
                    This skill has {skill.usersTeaching?.length || 0} teachers and {skill.usersLearning?.length || 0} learners in our community.
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Get Involved</Typography>
                  <Typography paragraph>
                    Join the community of learners and teachers for this skill. You can either learn from others or share your knowledge by teaching.
                  </Typography>
                </div>
              )}
            </Box>
          </Paper>
          
          {/* Related Skills */}
          {relatedSkills.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>You May Also Like</Typography>
              <Grid container spacing={2}>
                {relatedSkills
                  .filter(s => s._id !== skill._id)
                  .slice(0, 4)
                  .map((relatedSkill) => (
                    <Grid item xs={12} sm={6} md={6} key={relatedSkill._id}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            cursor: 'pointer'
                          }
                        }}
                        component={Link}
                        to={`/skills/${relatedSkill._id}`}
                      >
                        <SchoolIcon 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2, 
                            color: 'primary.main' 
                          }} 
                        />
                        <Box>
                          <Typography variant="subtitle2" noWrap>{relatedSkill.skillName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={`${relatedSkill.usersTeaching?.length || 0} Teaching`}
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            <Chip 
                              label={`${relatedSkill.usersLearning?.length || 0} Learning`}
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Box 
              sx={{ 
                height: 150, 
                backgroundColor: 'action.hover',
                borderRadius: 2,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Teachers</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {skill.usersTeaching?.length || 0}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Learners</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {skill.usersLearning?.length || 0}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {new Date(skill.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Get Involved</Typography>
              <Typography variant="body2" paragraph>
                Join the community of learners and teachers for this skill. You can either learn from others or share your knowledge.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Share This Skill</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="primary" size="small" onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
            
            {isAuthenticated ? (
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={handleExpressInterest}
                sx={{ mb: 2 }}
              >
                Express Interest
              </Button>
            ) : (
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={() => navigate('/login')}
                sx={{ mb: 2 }}
              >
                Login to Get Started
              </Button>
            )}
            
            <Button 
              fullWidth 
              variant="outlined" 
              size="large"
              startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              onClick={toggleBookmark}
            >
              {isBookmarked ? 'Bookmarked' : 'Save for later'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SkillDetails;
