import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, useTheme, Tooltip, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import { MdLanguage, MdTranslate } from 'react-icons/md';
import { TbLanguage, TbLanguageKatakana, TbLanguageOff } from 'react-icons/tb';
import { fetchWeather } from '../utils/api';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(10, 25, 41, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
}));

const WeatherInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '12px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.05)',
  '& svg': {
    width: '24px',
    height: '24px',
    color: theme.palette.mode === 'dark'
      ? theme.palette.primary.light
      : theme.palette.primary.main
  },
  '& .MuiTypography-root': {
    color: theme.palette.mode === 'dark'
      ? theme.palette.text.primary
      : theme.palette.text.primary,
    fontWeight: 500
  }
}));

const ThemeToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.25rem',
  borderRadius: '20px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.05)',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.08)',
  }
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
    transform: 'translateY(-2px)',
  }
}));

const LanguageMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.04)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(144, 202, 249, 0.16)'
      : 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(144, 202, 249, 0.24)'
        : 'rgba(25, 118, 210, 0.12)',
    },
  },
}));

const LanguageIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.04)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

const Header = ({ onThemeToggle, onLanguageChange, currentLanguage = 'en' }) => {
  const theme = useTheme();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Language menu texts
  const languages = {
    en: {
      name: 'English',
      prayerTimes: 'Prayer Times',
      home: 'Home',
      weather: 'Weather',
      settings: 'Settings',
      autoDetectLocation: 'Auto-detect Location'
    },
    ar: {
      name: 'العربية',
      prayerTimes: 'مواقيت الصلاة',
      home: 'الرئيسية',
      weather: 'الطقس',
      settings: 'الإعدادات',
      autoDetectLocation: 'تحديد الموقع تلقائياً'
    }
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    setAnchorEl(null);
    if (typeof lang === 'string') {
      onLanguageChange(lang);
    }
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Get city name from coordinates (you might want to use a geocoding service here)
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocation(data.city || 'Unknown Location');

            // Fetch weather for the location
            if (data.city) {
              const weatherData = await fetchWeather(data.city);
              setWeather(weatherData);
            }
          } catch (error) {
            console.error('Error fetching location data:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default city
          fetchWeather('London').then(setWeather);
        }
      );
    }
  }, []);

  const getLanguageIcon = (lang) => {
    switch (lang) {
      case 'en':
        return <TbLanguage style={{ fontSize: '24px' }} />;
      case 'ar':
        return <TbLanguageKatakana style={{ fontSize: '24px' }} />;
      default:
        return <TbLanguageOff style={{ fontSize: '24px' }} />;
    }
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {languages[currentLanguage].prayerTimes}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <NavLink to="/">{languages[currentLanguage].home}</NavLink>
            <NavLink to="/weather">{languages[currentLanguage].weather}</NavLink>
            <NavLink to="/settings">{languages[currentLanguage].settings}</NavLink>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {weather && (
            <WeatherInfo>
              <WiDaySunny />
              <Typography variant="body2" component="span">
                {location && `${location}: `}{Math.round(weather.temp)}°C
              </Typography>
            </WeatherInfo>
          )}

          <ThemeToggle>
            <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton
                onClick={onThemeToggle}
                color="inherit"
                sx={{
                  transition: 'background-color 0.3s ease',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {theme.palette.mode === 'dark' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WiNightClear style={{ fontSize: '24px', color: theme.palette.primary.light }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.primary.light,
                        fontWeight: 500
                      }}
                    >
                      Dark
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WiDaySunny style={{ fontSize: '24px', color: theme.palette.primary.main }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    >
                      Light
                    </Typography>
                  </Box>
                )}
              </IconButton>
            </Tooltip>
          </ThemeToggle>

          <Tooltip title={languages[currentLanguage].changeLanguage}>
            <LanguageIcon>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
                size="small"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getLanguageIcon(currentLanguage)}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {currentLanguage.toUpperCase()}
                  </Typography>
                </Box>
              </IconButton>
            </LanguageIcon>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                '& .MuiList-root': {
                  padding: theme.spacing(1),
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <LanguageMenuItem
              onClick={() => {
                onLanguageChange('en');
                setAnchorEl(null);
              }}
              selected={currentLanguage === 'en'}
            >
              <ListItemIcon>
                <TbLanguage style={{ fontSize: '20px' }} />
              </ListItemIcon>
              <ListItemText
                primary="English"
                primaryTypographyProps={{
                  sx: { fontWeight: currentLanguage === 'en' ? 600 : 400 }
                }}
              />
            </LanguageMenuItem>
            <LanguageMenuItem
              onClick={() => {
                onLanguageChange('ar');
                setAnchorEl(null);
              }}
              selected={currentLanguage === 'ar'}
            >
              <ListItemIcon>
                <TbLanguageKatakana style={{ fontSize: '20px' }} />
              </ListItemIcon>
              <ListItemText
                primary="العربية"
                primaryTypographyProps={{
                  sx: {
                    fontWeight: currentLanguage === 'ar' ? 600 : 400,
                    fontFamily: 'var(--font-family-arabic, Arial)',
                  }
                }}
              />
            </LanguageMenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 