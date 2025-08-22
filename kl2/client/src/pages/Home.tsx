import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper
} from '@mui/material';
import {
  Agriculture,
  Forum,
  TrendingUp,
  Build,
  People,
  Handshake
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Forum fontSize="large" color="primary" />,
      title: 'Community Chat',
      description: 'Ask questions, share knowledge, and connect with fellow farmers',
      link: '/community'
    },
    {
      icon: <TrendingUp fontSize="large" color="primary" />,
      title: 'Fair Pricing',
      description: 'Get fair prices for your crops with transparent marketplace',
      link: '/fair-pricing'
    },
    {
      icon: <Build fontSize="large" color="primary" />,
      title: 'Services',
      description: 'Rent tools, find labor, and access storage facilities',
      link: '/services'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Farmers Connected' },
    { number: '5,000+', label: 'Crops Listed' },
    { number: '2,000+', label: 'Questions Answered' },
    { number: '1,500+', label: 'Tools Shared' }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to KrishiLink
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          For the farmers, by the farmers, to the farmers
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
          Join India's largest farming community platform where farmers connect, 
          share knowledge, get fair prices for crops, and access essential services.
        </Typography>
        
        {!user && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{ mr: 2 }}
            >
              Join Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          What We Offer
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    component={Link}
                    to={feature.link}
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Paper sx={{ py: 6, px: 4, my: 6, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Impact
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold">
                  {stat.number}
                </Typography>
                <Typography variant="body1">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* How It Works Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <People fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                1. Join the Community
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register as a farmer and connect with thousands of others across India
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Handshake fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                2. Share & Learn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask questions, share experiences, and learn from fellow farmers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Agriculture fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                3. Grow Together
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access fair pricing, tools, and services to grow your farming business
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
