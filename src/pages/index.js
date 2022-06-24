import {useState, useEffect} from 'react';
import Head from 'next/head';
import { Box, Container, Grid, Snackbar, Alert} from '@mui/material';
import { WaceoUSD } from '../components/dashboard/waceoUSD';
import { TreasuryFunds } from '../components/dashboard/treasuryFunds'; 
import { WaceoTotalSupply } from '../components/dashboard/waceoTotalSupply';
import { WaceoEUR } from '../components/dashboard/waceoEUR';
import { WaceoAvax } from '../components/dashboard/waceoAvax';
import { WaceoSupply } from '../components/dashboard/waceoSupply';
import { DashboardLayout } from '../components/dashboard-layout'; 
import { getPrices, getBalances, getTreasuryAssets } from '../helpers'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = () => { 

  const [prices, setPrices] = useState();
  const [balances, setBalances] = useState([]);
  const [treasuryAssets, setTreasuryAseets] = useState([]);
  const [totalBalance, setTotalBalance ] = useState(0);
  const [totalValue, setTotalValue ] = useState(0);
  const [isLoading, setIsLoading ] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  useEffect(() => {  
    fetchData(); 
  }, []);

  useEffect(() => { }, [balances])


  const fetchData = async () => {
      const _prices = await getPrices();
      const _balances = await getBalances();
      const _treasuryAssets = await getTreasuryAssets();
       
      if(_prices){
        setPrices(_prices);
        if(_balances.success){
          setTotalBalance(_balances.total);
          setBalances(_balances.data);
        }  
        if(_treasuryAssets.success){
          setTreasuryAseets(_treasuryAssets.data); 
          setTotalValue(_treasuryAssets.total);
        }  
      }else{ 
        setAlertMessage("Wrong network!");
        setAlertSeverity("error");
        setTimeout(() => {
          fetchData();
        }, 3000);
      } 
      setIsLoading(false);
  }


  return( 
  <>
    <Head>
      <title>
        Dashboard | WACEO
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <WaceoUSD value={prices ? prices.waceoPriceInUsd: null}/>
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <WaceoEUR value={prices ? prices.waceoPriceInEur: null}/>
          </Grid>
        
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <WaceoAvax sx={{ height: '100%' }} value={prices ? prices.waceoPriceInAvax: null}/>
          </Grid> 
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <WaceoTotalSupply value={prices ? prices.waceoTotalSupply: null}/>
          </Grid>
          {treasuryAssets.length > 0  && (
            <Grid
              item
              lg={6}
              md={6}
              xl={6}
              xs={12}
            > 
              <TreasuryFunds sx={{ height: '100%' }} data={treasuryAssets ? treasuryAssets: null} total={totalValue} />
            </Grid> 
          )} 
          {balances.length > 0  && (
            <Grid
              item
              lg={6}
              md={6}
              xl={6}
              xs={12}
            >
              <WaceoSupply sx={{ width:'100%', height: '100%' }} data={balances ? balances: null} total={totalBalance} />
            </Grid> 
          )} 
        </Grid>
      </Container>
    </Box>
    <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading} 
        >
            <CircularProgress color="primary" />
    </Backdrop>
    <Snackbar 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right'  }}
          open={alertMessage.length} 
          autoHideDuration={8000}  
          onClose={() => setAlertMessage("") } 
      >
          <Alert severity={alertSeverity}  style={{marginBottom: 50,  width: 400}}>
              <strong>{alertMessage}</strong>  
          </Alert>
    </Snackbar>
  </>
  )
};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
