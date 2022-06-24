import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material'; 
import { RequestDetails } from '../components/request/index';
import { DashboardLayout } from '../components/dashboard-layout';
import { getBaseToken, getQuotes, getAllowance, approveTokens, mintAutoAllocationDouble } from '../helpers';
import { useContext } from 'react';
import { Web3Context } from '../web3/web3Context';

const Request = () => {
  const { account } = useContext(Web3Context);

  return (
    <>
    <Head>
      <title>
        Request | WACEO
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
       
        <Grid
          container
          spacing={3}
        > 
          <Grid
            item
            lg={12}
            md={6}
            xs={12}
          >
            <RequestDetails 
                getBaseToken={getBaseToken} 
                getQuotes={getQuotes} 
                getAllowance={getAllowance} 
                approveTokens={approveTokens}
                mintAutoAllocationDouble={mintAutoAllocationDouble}
                account={account}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
  )
};

Request.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Request;
