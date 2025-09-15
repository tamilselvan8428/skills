import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { School as SchoolIcon, People as PeopleIcon } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const SkillCard = ({ skill }) => {
  const teachingCount = skill.usersTeaching?.length || 0;
  const learningCount = skill.usersLearning?.length || 0;

  return (
    <StyledCard elevation={3}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
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
        
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip 
            icon={<PeopleIcon />}
            label={`${teachingCount} Teaching`}
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<PeopleIcon />}
            label={`${learningCount} Learning`}
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component={RouterLink}
          to={`/skills/${skill._id}`}
          variant="contained"
          size="small"
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default SkillCard;
