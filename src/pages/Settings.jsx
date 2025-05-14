import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Container,
  Paper,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
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
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 40px rgba(0, 0, 0, 0.4)'
      : '0 8px 40px rgba(0, 0, 0, 0.1)'
  }
}));

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const Settings = ({ themeMode, onThemeChange, defaultLocation, onLocationChange }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('prayerTimesSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: true,
      notifications: false,
      autoLocation: false,
      calculationMethod: 5, // Default to Muslim World League
      timeFormat: '12h'
    };
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    localStorage.setItem('prayerTimesSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = useCallback((setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    setSnackbar({
      open: true,
      message: 'Settings updated successfully',
      severity: 'success'
    });
  }, []);

  const handleLocationChange = useCallback((location) => {
    if (location) {
      setSettings(prev => ({
        ...prev,
        defaultLocation: location
      }));
      setSnackbar({
        open: true,
        message: 'Default location updated',
        severity: 'success'
      });
    }
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleThemeChange = (event) => {
    onThemeChange(event.target.checked ? 'dark' : 'light');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledContainer maxWidth="md">
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Settings
        </Typography>

        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === 'dark'}
                  onChange={handleThemeChange}
                  color="primary"
                />
              }
              label="Dark Mode"
            />
          </FormGroup>
        </StyledPaper>

        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Default Location
          </Typography>
          <Box sx={{ mt: 2 }}>
            <LocationSelector
              defaultLocation={defaultLocation}
              onLocationChange={onLocationChange}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This location will be used as the default for prayer times and weather information.
          </Typography>
        </StyledPaper>

        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Prayer Time Settings
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Enable Prayer Time Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Use 24-hour Format"
            />
          </FormGroup>
        </StyledPaper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledContainer>
    </motion.div>
  );
};

export default Settings;
