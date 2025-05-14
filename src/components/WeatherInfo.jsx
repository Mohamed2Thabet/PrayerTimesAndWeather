import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Paper, Typography, Box } from '@mui/material';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const StyledPaper = styled(Paper)`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`;

const WeatherIconWrapper = styled.div`
  font-size: 3rem;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
`;

const getWeatherIcon = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'clear':
      return <WiDaySunny />;
    case 'clouds':
      return <WiCloudy />;
    case 'rain':
      return <WiRain />;
    case 'snow':
      return <WiSnow />;
    case 'thunderstorm':
      return <WiThunderstorm />;
    default:
      return <WiDaySunny />;
  }
};

const WeatherInfo = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Replace with your OpenWeather API key and actual city data
        const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
        const city = 'London'; // This should come from your location selector
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        
        if (response.ok) {
          setWeather({
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
          });
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []); // In reality, this should depend on the selected location

  if (loading) {
    return (
      <StyledPaper>
        <Typography>Loading weather information...</Typography>
      </StyledPaper>
    );
  }

  if (error) {
    return (
      <StyledPaper>
        <Typography color="error">{error}</Typography>
      </StyledPaper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper>
        <Typography variant="h6" align="center" gutterBottom>
          Current Weather
        </Typography>
        
        <WeatherIconWrapper>
          {getWeatherIcon(weather?.condition)}
        </WeatherIconWrapper>

        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            {weather?.temperature}°C
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            {weather?.description}
          </Typography>

          <Box mt={2}>
            <Typography variant="body2">
              Humidity: {weather?.humidity}%
            </Typography>
            <Typography variant="body2">
              Wind Speed: {weather?.windSpeed} m/s
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </motion.div>
  );
};

export default WeatherInfo;
