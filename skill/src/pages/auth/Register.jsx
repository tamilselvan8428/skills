import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper, Grid, Link as MuiLink, FormControlLabel, Checkbox, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    college: '',
    major: '',
    graduationYear: '',
    company: '',
    position: '',
    skillsToTeach: [],
    skillsToLearn: [],
  });
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Map frontend fields to backend payload
    const skillsToTeach = Array.isArray(formData.skillsToTeach)
      ? formData.skillsToTeach
      : String(formData.skillsToTeach || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    const skillsToLearn = Array.isArray(formData.skillsToLearn)
      ? formData.skillsToLearn
      : String(formData.skillsToLearn || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    const professionalDetails =
      formData.userType === 'professional'
        ? [formData.company, formData.position].filter(Boolean).join(' - ')
        : '';

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      contact: '',
      college: formData.userType === 'student' ? formData.college : '',
      professionalDetails,
      skillsToTeach,
      skillsToLearn,
    };

    try {
      setSubmitting(true);
      const result = await register(payload);
      if (result?.success) {
        // register() navigates to dashboard on success per AuthContext
        return;
      }
      setError(result?.error || 'Registration failed');
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 8 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Create Your Account
        </Typography>
        {error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>{error}</Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <TextField
                required
                fullWidth
                margin="normal"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>I am a</InputLabel>
                <Select
                  name="userType"
                  value={formData.userType}
                  label="I am a"
                  onChange={handleChange}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="professional">Working Professional</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {formData.userType === 'student' ? (
                <>
                  <Typography variant="h6" gutterBottom>Education Details</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="college"
                    label="College/University"
                    value={formData.college}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="major"
                    label="Major/Field of Study"
                    value={formData.major}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="graduationYear"
                    label="Expected Graduation Year"
                    type="number"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>Professional Details</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="company"
                    label="Company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="position"
                    label="Position/Role"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </>
              )}
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Skills</Typography>
              <TextField
                fullWidth
                margin="normal"
                name="skillsToTeach"
                label="Skills You Can Teach (comma separated)"
                value={formData.skillsToTeach}
                onChange={handleChange}
                placeholder="e.g., Python, Graphic Design, Public Speaking"
              />
              <TextField
                fullWidth
                margin="normal"
                name="skillsToLearn"
                label="Skills You Want to Learn (comma separated)"
                value={formData.skillsToLearn}
                onChange={handleChange}
                placeholder="e.g., Data Science, Photography, Spanish"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ px: 6, py: 1.5 }}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </Box>
          
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
