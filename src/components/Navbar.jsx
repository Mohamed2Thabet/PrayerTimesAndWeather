import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { FaMosque, FaCog, FaHome } from 'react-icons/fa';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(30, 30, 30, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
}));

const NavButton = styled(Button, {  
  shouldForwardProp: prop => prop !== 'isActive'
})(({ theme, isActive }) => ({
  margin: '0 8px',
  padding: '6px 16px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  color: isActive ? theme.palette.primary.main : 'inherit',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: isActive ? '100%' : '0',
    height: '2px',
    background: theme.palette.primary.main,
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)'
  },
  '&:hover:after': {
    width: '100%'
  }
}));

const IconWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    transform: 'scale(1.05)'
  },
  '& svg': {
    color: theme.palette.primary.main
  }
}));

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  const buttonVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <StyledAppBar position="sticky">
        <Toolbar>
          <IconWrapper
            component={RouterLink}
            to="/"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FaMosque size={28} />
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Prayer Times
            </Typography>
          </IconWrapper>

          <Box sx={{ flexGrow: 1 }} />

          <AnimatePresence>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'flex' }}
            >
              <NavButton
                component={RouterLink}
                to="/"
                isActive={location.pathname === '/'}
                startIcon={isMobile ? null : <FaHome />}
              >
                {isMobile ? <FaHome size={20} /> : 'Home'}
              </NavButton>

              <NavButton
                component={RouterLink}
                to="/settings"
                isActive={location.pathname === '/settings'}
                startIcon={isMobile ? null : <FaCog />}
              >
                {isMobile ? <FaCog size={20} /> : 'Settings'}
              </NavButton>
            </motion.div>
          </AnimatePresence>
        </Toolbar>
      </StyledAppBar>
    </motion.div>
  );
};

export default Navbar;
