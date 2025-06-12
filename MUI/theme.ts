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

