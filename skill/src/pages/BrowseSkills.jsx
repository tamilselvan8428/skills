import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, TextField, InputAdornment, Alert } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import SkillCard from '../components/skills/SkillCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { skillsApi } from '../services/api';

const BrowseSkills = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch skills from API
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
  
  // Filter and sort skills based on search
  const filteredSkills = skills
    ?.filter(skill => 
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by most recent first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Browse Skills
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover and learn new skills from our community
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Skills Grid */}
      {filteredSkills?.length > 0 ? (
        <Grid container spacing={3}>
          {filteredSkills.map((skill) => (
            <Grid item key={skill._id} xs={12} sm={6} md={4} lg={3}>
              <SkillCard skill={skill} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'No skills found matching your search' : 'No skills available yet'}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default BrowseSkills;
