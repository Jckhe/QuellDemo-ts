import {createTheme} from '@mui/material/'  

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ABA277  ',
      light: '#44ccec',
      dark: '#D5C395',
    },
    secondary: {
      main: '#D5C395',
    },
    // overrides: {
    //    MuiButton: {
    //     raisedPrimary: {
    //       color: '',
    // },
    background: {
      default: '#e4e4e4',
      paper: '#bdbdbd',
    },
    error: {
      main: '#ff5243',
    },
    success: {
      main: '#48aa4c',
    },
  },
})
