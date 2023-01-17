import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Outlet,
  Link as RouterLink,
} from "react-router-dom"
import PropTypes from 'prop-types';

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};


const theme = createTheme({
  palette: {
    purple: {
      main: '#6E42CC',
      light: '#845ED4',
      dark: '#512BA1',
    },
    white: {
      main: '#fff',
      light: '#fff',
      dark: '#fff',
    }
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  )
}

export default App
