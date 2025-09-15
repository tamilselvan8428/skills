import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              SkillShare Hub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empowering people to share knowledge and learn new skills in a collaborative environment.
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li><Link component={RouterLink} to="/about" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>About Us</Link></li>
              <li><Link component={RouterLink} to="/careers" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Careers</Link></li>
              <li><Link component={RouterLink} to="/blog" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Blog</Link></li>
              <li><Link component={RouterLink} to="/press" color="text.secondary" underline="hover" sx={{ display: 'block' }}>Press</Link></li>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li><Link component={RouterLink} to="/help" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Help Center</Link></li>
              <li><Link component={RouterLink} to="/privacy" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Privacy Policy</Link></li>
              <li><Link component={RouterLink} to="/terms" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Terms of Service</Link></li>
              <li><Link component={RouterLink} to="/cookies" color="text.secondary" underline="hover" sx={{ display: 'block' }}>Cookie Policy</Link></li>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Community
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li><Link component={RouterLink} to="/community/guidelines" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Guidelines</Link></li>
              <li><Link component={RouterLink} to="/community/events" color="text.secondary" underline="hover" sx={{ display: 'block', mb: 1 }}>Events</Link></li>
              <li><Link component={RouterLink} to="/community/partners" color="text.secondary" underline="hover" sx={{ display: 'block' }}>Partners</Link></li>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" color="inherit">
                <Facebook />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" color="inherit">
                <Twitter />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" color="inherit">
                <Instagram />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" color="inherit">
                <LinkedIn />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" color="inherit">
                <GitHub />
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Subscribe to our newsletter for the latest updates
            </Typography>
          </Grid>
        </Grid>
        
        <Box mt={5} pt={3} borderTop={1} borderColor="divider">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} SkillShare Hub. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link component={RouterLink} to="/privacy" color="text.secondary" variant="body2" underline="hover">
                  Privacy
                </Link>
                <Link component={RouterLink} to="/terms" color="text.secondary" variant="body2" underline="hover">
                  Terms
                </Link>
                <Link component={RouterLink} to="/sitemap" color="text.secondary" variant="body2" underline="hover">
                  Sitemap
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
