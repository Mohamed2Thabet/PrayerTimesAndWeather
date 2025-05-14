import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Typography, Box, Container, Paper } from '@mui/material';
import LocationSelector from '../components/LocationSelector';
import PrayerTimes from '../components/PrayerTimes';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const Home = ({ defaultLocation, onLocationChange }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    return savedLocation ? JSON.parse(savedLocation) : defaultLocation;
  });

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
      onLocationChange(selectedLocation);
    }
  }, [selectedLocation, onLocationChange]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <StyledContainer maxWidth="lg">
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
                : 'linear-gradient(45deg, #1976d2, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Prayer Times
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }}
          >
            Find accurate prayer times for your location
          </Typography>
        </Box>

        <StyledPaper elevation={3}>
          <LocationSelector
            onLocationChange={handleLocationChange}
            defaultLocation={selectedLocation || defaultLocation}
          />
        </StyledPaper>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Box mt={4}>
            <PrayerTimes location={selectedLocation} />
          </Box>
        </motion.div>
      </StyledContainer>
    </motion.div>
  );
};

export default Home;
