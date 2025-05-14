import  { useEffect, useState } from 'react';
import { CircularProgress, Alert, Box, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import { fetchPrayerTimes, fetchWeather } from '../utils/api';
import Weather from './Weather';
import moment from 'moment';

const StyledPaper = styled(Paper)`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const PrayerCard = styled(motion.div)`
  height: 100%;
`;

const getIcon = (prayer) => {
  const nightPrayers = ['Isha', 'Fajr'];
  return nightPrayers.includes(prayer) ? <FaMoon size={24} /> : <FaSun size={24} />;
};

const PrayerTimes = ({ location }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        const [prayerData, weatherData] = await Promise.all([
          fetchPrayerTimes(location.city, location.country),
          fetchWeather(location.city)
        ]);

        setPrayerTimes(prayerData);
        setWeather(weatherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (!location) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please select a location to view prayer times
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {location && (
        <Typography variant="h5" gutterBottom align="center">
          Prayer Times for {location.city}, {location.country}
        </Typography>
      )}

      {weather && (
        <Box sx={{ mb: 4 }}>
          <Weather weather={weather} />
        </Box>
      )}

      {prayerTimes && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {Object.entries(prayerTimes.timings)
              .filter(([prayer]) => [
                'Fajr',
                'Sunrise',
                'Dhuhr',
                'Asr',
                'Maghrib',
                'Isha',
              ].includes(prayer))
              .map(([prayer, time]) => {
                const formattedTime = moment(time, 'HH:mm').format('hh:mm A');
                const isNext = moment(time, 'HH:mm').isAfter(moment());

                return (
                  <Grid item xs={12} sm={6} md={4} key={prayer}>
                    <PrayerCard variants={itemVariants}>
                      <StyledPaper 
                        elevation={3}
                        sx={{
                          border: isNext ? '2px solid' : 'none',
                          borderColor: 'primary.main',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {getIcon(prayer)}
                          <Typography variant="h6">{prayer}</Typography>
                          <Typography variant="h5" color="primary">
                            {formattedTime}
                          </Typography>
                          {isNext && (
                            <Typography variant="caption" color="primary">
                              Next Prayer
                            </Typography>
                          )}
                        </Box>
                      </StyledPaper>
                    </PrayerCard>
                  </Grid>
                );
              })}
          </Grid>
        </motion.div>
      )}

      {prayerTimes && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Date: {moment(prayerTimes.date.readable).format('dddd, MMMM D, YYYY')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PrayerTimes;
