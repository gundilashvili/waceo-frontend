import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { Web3Provider } from '../web3/web3Context'

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (  
      <CacheProvider value={emotionCache}> 
          <Head>
            <title>
              WACEO
            </title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Web3Provider>
                {getLayout(<Component {...pageProps} />)}
              </Web3Provider>
            </ThemeProvider>
          </LocalizationProvider>  
      </CacheProvider>
     
  );
};

export default App;
