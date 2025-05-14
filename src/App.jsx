import React, { useState, useEffect } from 'react';
import { CssBaseline, Box } from "@mui/material";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import Header from './components/Header';
import Home from './pages/Home';
import WeatherPage from './pages/WeatherPage';
import Settings from './pages/Settings';

// Create rtl cache with prefixer
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true,
});

// Create ltr cache with prefixer
const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
  prepend: true,
});

// Create theme with dark and light mode
const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      primary: {
        main: '#90caf9',
        light: '#b3e5fc',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#f48fb1',
        light: '#f8bbd0',
        dark: '#ec407a',
      },
      background: {
        default: '#0a1929',
        paper: '#1a2027',
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    } : {
      primary: {
        main: '#2563eb',
        light: '#60a5fa',
        dark: '#1d4ed8',
      },
      secondary: {
        main: '#db2777',
        light: '#ec4899',
        dark: '#be185d',
      },
      background: {
        default: '#f0f9ff',
        paper: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: 'rgba(15, 23, 42, 0.7)',
      },
    }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: mode === 'dark' ? "#6b6b6b transparent" : "#959595 transparent",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: mode === 'dark' ? "#6b6b6b" : "#959595",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          }
        }
      }
    }
  }
});

const AppWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  transition: 'background-color 0.3s ease'
}));

export default function App() {
  // Initialize theme from localStorage or default to 'dark'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark';
  });

  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Initialize location from localStorage or null
  const [defaultLocation, setDefaultLocation] = useState(() => {
    const savedLocation = localStorage.getItem('defaultLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });

  // Save theme mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // You could add additional language-specific logic here
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Save default location to localStorage whenever it changes
  useEffect(() => {
    if (defaultLocation) {
      localStorage.setItem('defaultLocation', JSON.stringify(defaultLocation));
    }
  }, [defaultLocation]);

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  const cache = React.useMemo(
    () => (language === 'ar' ? cacheRtl : cacheLtr),
    [language]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <CacheProvider value={cache}>
      <LanguageProvider currentLanguage={language}>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppWrapper dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header
                onThemeToggle={toggleTheme}
                onLanguageChange={handleLanguageChange}
                currentLanguage={language}
                defaultLocation={defaultLocation}
              />
              <Box sx={{ py: 4 }}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        defaultLocation={defaultLocation}
                        onLocationChange={setDefaultLocation}
                      />
                    }
                  />
                  <Route
                    path="/weather"
                    element={
                      <WeatherPage
                        defaultLocation={defaultLocation}
                        onLocationChange={setDefaultLocation}
                      />
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Settings
                        themeMode={mode}
                        onThemeChange={setMode}
                        defaultLocation={defaultLocation}
                        onLocationChange={setDefaultLocation}
                        currentLanguage={language}
                        onLanguageChange={handleLanguageChange}
                      />
                    }
                  />
                </Routes>
              </Box>
            </AppWrapper>
          </ThemeProvider>
        </Router>
      </LanguageProvider>
    </CacheProvider>
  );
}
