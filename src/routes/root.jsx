import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Outlet } from "react-router-dom"

const theme = createTheme({
  palette: {
    purple: {
      main: '#6E42CC',
      light: '#845ED4',
      dark: '#512BA1',
    }
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
