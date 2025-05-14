import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress, Alert, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaLocationArrow } from 'react-icons/fa';
import { fetchCountries, fetchCities } from '../utils/api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '1.5rem',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const SelectWrapper = styled(Box)(({ theme }) => ({
  margin: '1rem 0',
  '& .MuiFormControl-root': {
    width: '100%'
  },
  '& .MuiInputBase-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  '& .MuiSelect-select': {
    color: theme.palette.text.primary
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary
  }
}));

const IconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem',
  color: theme.palette.primary.main
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
  gap: '1rem'
}));

const LocationSelector = ({ onLocationChange, defaultLocation }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchCountries();
        setCountries(data);

        // If we have a default location, set it
        if (defaultLocation) {
          const country = data.find(c => c.label === defaultLocation.country);
          if (country) {
            setSelectedCountry(country.value);
            // Cities will be loaded by the other useEffect
          }
        }
      } catch (error) {
        setError('Failed to load countries: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, [defaultLocation]);

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedCountry) return;

      try {
        setLoading(true);
        setCities([]);
        setSelectedCity('');

        const countryData = countries.find(c => c.value === selectedCountry);
        if (countryData) {
          const cityData = await fetchCities(countryData.label);
          setCities(cityData);

          // If we have a default location and it matches the current country
          if (defaultLocation && countryData.label === defaultLocation.country) {
            const city = cityData.find(c => c.label === defaultLocation.city);
            if (city) {
              setSelectedCity(city.value);
              onLocationChange(defaultLocation);
            }
          }
        }
      } catch (error) {
        setError('Failed to load cities: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [selectedCountry, countries, defaultLocation]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedCity('');
    onLocationChange(null);
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);

    const country = countries.find(c => c.value === selectedCountry);
    if (country && city) {
      onLocationChange({
        city: city,
        country: country.label
      });
    }
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            if (data.city && data.countryName) {
              const country = countries.find(c => c.label === data.countryName);
              if (country) {
                setSelectedCountry(country.value);
                const cityData = await fetchCities(data.countryName);
                setCities(cityData);
                const city = cityData.find(c => c.label === data.city);
                if (city) {
                  setSelectedCity(city.value);
                  onLocationChange({
                    city: city.value,
                    country: data.countryName
                  });
                }
              }
            }
          } catch (error) {
            setError('Failed to detect location: ' + error.message);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Location detection failed: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper elevation={3}>
        <IconWrapper>
          <FaGlobeAmericas size={24} />
          <Typography variant="h6">Select Location</Typography>
        </IconWrapper>

        <ButtonWrapper>
          <Button
            startIcon={<FaLocationArrow />}
            variant="contained"
            color="primary"
            onClick={handleAutoDetect}
            disabled={loading}
          >
            Auto-detect Location
          </Button>
        </ButtonWrapper>

        {error && (
          <Alert severity="error" sx={{ my: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        )}

        <SelectWrapper>
          <FormControl>
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedCountry}
              label="Country"
              onChange={handleCountryChange}
              disabled={loading}
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SelectWrapper>

        <SelectWrapper>
          <FormControl disabled={!selectedCountry || loading}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCity}
              label="City"
              onChange={handleCityChange}
            >
              {cities.map((city) => (
                <MenuItem key={city.value} value={city.value}>
                  {city.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SelectWrapper>
      </StyledPaper>
    </motion.div>
  );
};

export default LocationSelector;
