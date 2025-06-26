// MUI/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  components: {
    // Configuración global del componente Divider
    MuiDivider: {
      styleOverrides: {
        root: {
          marginTop: '16px',
          marginBottom: '16px',
          borderColor: '#1976d2', // primary.main
          borderBottomWidth: '2px',
          opacity: 0.6,
        },
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 40,
      '@media (min-width:0px)': {
        minHeight: 40,
      },
      '@media (min-width:600px)': {
        minHeight: 40,
      },
    },
  },
});

export default theme;

