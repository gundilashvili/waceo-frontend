import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material'; 
import { Multisig } from '../components/admin/index';
import { DashboardLayout } from '../components/dashboard-layout';
import { getRequest, getAllowance} from '../helpers';
import { 
  getOwners, 
  Submit, 
  mintBasic, 
  mintAutoAllocationSingle, 
  getTransaction , 
  ConfirmTransaction, 
  getMinterTransactions
} from '../helpers'
import   NotFound  from './404'

const Admin = () => {


  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(
    () => {  
      getListOfOwners()
    } 
  );

  const getListOfOwners = async () => {
    try{
      const response = await getOwners();    
      if(response.success){
        if(response.owners && response.account){ 
          for(let i of response.owners){
            if(i.toString().toLowerCase() == response.account.toString().toLowerCase()){
              setIsOwner(true); 
            }
          }  
          setIsLoading(false);
        }else{
          setTimeout(() => {
            getListOfOwners()
          }, 2000);
        } 
      } 
    }catch(e){
      console.log(e);
    }
  }


  return (
    <>
    {isOwner && !isLoading && (
      <div>
         <Head>
           <title>
             Requests | WACEO
           </title>
         </Head>
         <Box
           component="main"
           sx={{
             flexGrow: 1,
             py: 4
           }}
         >  
          <Multisig  
              getRequest={getRequest} 
              getAllowance={getAllowance}
              submit={Submit}  
              mintBasic={mintBasic}
              mintAutoAllocationSingle={mintAutoAllocationSingle}
              getTransaction={getTransaction}
              ConfirmTransaction={ConfirmTransaction}
              getMinterTransactions={getMinterTransactions}
            /> 
         </Box>
       </div>
    ) }
     {!isOwner && !isLoading && (
       <NotFound/>
     )}

    </>
  )  
};

Admin.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Admin;
