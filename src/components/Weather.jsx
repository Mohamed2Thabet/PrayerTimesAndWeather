import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { fetchWeather } from '../utils/api';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiDust,
  WiNa,
  WiHumidity,
  WiStrongWind,
  WiThermometer,
  WiNightClear
} from 'react-icons/wi';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '2rem',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 30px rgba(0, 0, 0, 0.3)'
    : '0 4px 30px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.5)'}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 40px rgba(0, 0, 0, 0.4)'
      : '0 8px 40px rgba(0, 0, 0, 0.15)'
  }
}));

const WeatherIcon = styled(Box)(({ theme }) => ({
  '& svg': {
    width: '64px',
    height: '64px',
    color: theme.palette.primary.main,
    filter: theme.palette.mode === 'dark'
      ? 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.3))'
      : 'drop-shadow(0 0 8px rgba(25, 118, 210, 0.2))'
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: theme.palette.text.secondary,
  '& svg': {
    width: '20px',
    height: '20px'
  }
}));

const WeatherContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
}));

const WeatherDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1.5rem',
  marginTop: '1rem',
  padding: '1rem',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.03)'
    : 'rgba(0, 0, 0, 0.03)',
  borderRadius: '12px'
}));

const getWeatherIcon = (condition) => {
  const conditionLower = condition?.toLowerCase() || '';
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) return <WiDaySunny />;
  if (conditionLower.includes('cloud')) return <WiCloudy />;
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return <WiRain />;
  if (conditionLower.includes('snow')) return <WiSnow />;
  if (conditionLower.includes('thunder')) return <WiThunderstorm />;
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return <WiFog />;
  if (conditionLower.includes('dust') || conditionLower.includes('sand')) return <WiDust />;
  return <WiNa />;
};

const Weather = ({ city }) => {
  const theme = useTheme();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  if (!city) return null;
  if (loading) return (
    <Box display="flex" justifyContent="center" p={2}>
      <CircularProgress size={40} />
    </Box>
  );
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: '12px',
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(211, 47, 47, 0.1)'
            : 'rgba(211, 47, 47, 0.05)'
        }}
      >
        {error}
      </Alert>
    );
  }
  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <StyledPaper elevation={3}>
        <WeatherContainer>
          <Box display="flex" alignItems="center" gap={3}>
            <WeatherIcon>
              {getWeatherIcon(weather.condition)}
            </WeatherIcon>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
                    : 'linear-gradient(45deg, #1976d2, #2196f3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {Math.round(weather.temp)}°C
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500
                }}
              >
                {weather.description}
              </Typography>
            </Box>
          </Box>

          <WeatherDetails>
            <InfoItem>
              <WiThermometer />
              <Typography variant="body2">
                Feels like: {Math.round(weather.feels_like)}°C
              </Typography>
            </InfoItem>
            <InfoItem>
              <WiHumidity />
              <Typography variant="body2">
                Humidity: {weather.humidity}%
              </Typography>
            </InfoItem>
            <InfoItem>
              <WiStrongWind />
              <Typography variant="body2">
                Wind: {Math.round(weather.wind_speed)} km/h
              </Typography>
            </InfoItem>
          </WeatherDetails>
        </WeatherContainer>
      </StyledPaper>
    </motion.div>
  );
};

export default Weather;
