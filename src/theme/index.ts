import { createTheme } from '@mui/material/styles';

export function getTheme(dark: boolean) {
  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: { main: '#4DA0B0' },
      secondary: { main: '#F7971E' },
      background: {
        default: dark ? '#0a0e1a' : '#E8F4FD',
        paper: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.75)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", sans-serif',
      h1: { fontWeight: 900 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 6 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(20px)',
            border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.18)',
            boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.25)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 700, borderRadius: 8 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });
}
