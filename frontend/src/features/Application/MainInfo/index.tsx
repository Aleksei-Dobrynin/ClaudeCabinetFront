// src/theme/index.tsx
import React from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';
import CssBaseline from '@mui/material/CssBaseline';
// src/index.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import { configure } from 'mobx';
import { StoreProvider } from './stores/StoreContext';
import { rootStore } from './stores/RootStore';


declare module '@mui/material/styles' {
  interface Palette {
    customBlue: Palette['primary'];
    customGreen: Palette['success'];
    customYellow: Palette['warning'];
    customRed: Palette['error'];
  }

  interface PaletteOptions {
    customBlue?: PaletteOptions['primary'];
    customGreen?: PaletteOptions['success'];
    customYellow?: PaletteOptions['warning'];
    customRed?: PaletteOptions['error'];
  }
}

let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', 
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#673ab7', 
      light: '#9575cd',
      dark: '#512da8',
      contrastText: '#fff',
    },
    error: {
      main: '#ef5350',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      main: '#03a9f4',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161',
    },
    customBlue: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    customGreen: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customYellow: {
      main: '#ffc107',
      light: '#ffd54f',
      dark: '#ffa000',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customRed: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none', 
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 4, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, 
          textTransform: 'none', 
          fontWeight: 500,
          padding: '8px 16px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1565c0', 
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
          fontWeight: 500,
          minWidth: 'auto',
          padding: '12px 16px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem', 
          backgroundColor: 'rgba(33, 33, 33, 0.9)', 
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: 'currentColor', 
          textUnderlineOffset: '2px', 
        },
      },
    },
  },
}, ruRU); 

theme = responsiveFontSizes(theme);

interface ThemeConfigProps {
  children: React.ReactNode;
}

export const ThemeConfig: React.FC<ThemeConfigProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      {children}
    </ThemeProvider>
  );
};

configure({
  enforceActions: 'observed',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: false,
  disableErrorBoundaries: false
});

const Maininfo: React.FC<ThemeConfigProps> = ({ children }) => {
  return (
    <StoreProvider store={rootStore}>
      <ThemeConfig>
        <App />
      </ThemeConfig>
    </StoreProvider>
  );
};

export default Maininfo
