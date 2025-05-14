import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Weather from '../components/Weather';
import LocationSelector from '../components/LocationSelector';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
}));

const WeatherPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Get user's location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            if (data.city) {
              setCurrentLocation({
                city: data.city,
                country: data.countryName
              });
            }
          } catch (error) {
            console.error('Error fetching location data:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Weather Information
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Select Location
              </Typography>
              <LocationSelector onLocationChange={setSelectedLocation} />
            </StyledPaper>
          </Grid>

          {currentLocation && !selectedLocation && (
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Current Location Weather
                </Typography>
                <Weather city={currentLocation.city} />
              </Box>
            </Grid>
          )}

          {selectedLocation && (
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Selected Location Weather
                </Typography>
                <Weather city={selectedLocation.city} />
              </Box>
            </Grid>
          )}
        </Grid>
      </StyledContainer>
    </motion.div>
  );
};

export default WeatherPage; 