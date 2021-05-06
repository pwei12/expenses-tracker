import { ThemeProvider } from 'styled-components';
import { theme } from '../src/constants/style';
import '../styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
