import {createTheme} from '@mui/material/'  

export const theme = createTheme({
  palette: {
    primary: {
      main: '#11DCF7',
      light: '#44ccec',
      dark: '#014d64',
    },
    secondary: {
      main: '#001af5',
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
