import React from 'react';
import { Box, Button, Container, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4, 0),
  background: theme.palette.mode === 'light' 
    ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)' 
    : 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${theme.palette.mode === 'light' ? '9e9e9e' : '424242'}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    opacity: 0.5,
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6],
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  '& .stat-number': {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    lineHeight: 1.2,
    marginBottom: theme.spacing(1),
  },
  '& .stat-label': {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <SchoolIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />,
      title: 'Learn New Skills',
      description: 'Discover and learn from a wide range of skills taught by experts and enthusiasts from around the world.'
    },
    {
      icon: <CodeIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />,
      title: 'Teach What You Know',
      description: 'Share your knowledge and expertise with others by creating and hosting your own learning sessions.'
    },
    {
      icon: <GroupIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />,
      title: 'Join a Community',
      description: 'Connect with like-minded individuals, collaborate on projects, and grow your professional network.'
    },
    {
      icon: <VideoLibraryIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />,
      title: 'Access Recordings',
      description: 'Missed a live session? No worries! Access recorded sessions and learn at your own pace.'
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Learners' },
    { number: '2,500+', label: 'Expert Instructors' },
    { number: '5,000+', label: 'Courses Available' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <Typography 
                  variant={isMobile ? 'h3' : 'h2'} 
                  component="h1" 
                  gutterBottom
                  sx={{ fontWeight: 800, lineHeight: 1.2 }}
                >
                  Learn, Teach, and Grow with{' '}
                  <Box 
                    component="span" 
                    sx={{ 
                      color: 'primary.main',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        left: 0,
                        right: 0,
                        height: '15%',
                        backgroundColor: 'primary.light',
                        opacity: 0.3,
                        zIndex: -1,
                      }
                    }}
                  >
                    SkillSwap
                  </Box>
                </Typography>
                <Typography 
                  variant={isMobile ? 'h6' : 'h5'} 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 4 }}
                >
                  Join our community of learners and educators. Share your knowledge, learn new skills, and connect with people who share your passions.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 4 }}>
                  <Button 
                    component={RouterLink} 
                    to="/register" 
                    variant="contained" 
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    Get Started - It's Free
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/browse" 
                    variant="outlined" 
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    Browse Skills
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box 
                  component="img"
                  src="https://illustrations.popsy.co/white/learning.svg"
                  alt="People learning together"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 600,
                    filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box py={10} bgcolor="background.default">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Why Choose SkillSwap?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              maxWidth="700px" 
              mx="auto"
            >
              We provide the best platform for both learners and educators to connect, share knowledge, and grow together.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid xs={12} sm={6} md={3} key={index}>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <FeatureCard>
                    {feature.icon}
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={8} bgcolor="primary.main" color="primary.contrastText">
        <Container maxWidth="lg">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={2} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <StatItem>
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </StatItem>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={12} textAlign="center">
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <EmojiEventsIcon 
              color="primary" 
              sx={{ 
                fontSize: 60, 
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }} 
            />
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Ready to Start Your Learning Journey?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              paragraph
              sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
            >
              Join thousands of learners and educators who are already part of our growing community. 
              Whether you want to learn something new or share your expertise, we've got you covered.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="contained" 
              size="large"
              startIcon={<StarIcon />}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              Join Now - It's Free
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
