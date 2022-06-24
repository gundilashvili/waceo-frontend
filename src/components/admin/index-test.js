import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {SubmitTransaction}  from './components/submit-transaction'
import { MintIDO }  from './components/mint-ido'
import { MintSingle}  from './components/mint-single'
import { ConfirmTransaction}  from './components/confirm-transaction'
import { Transactions }  from './components/transactions'

export const Multisig = (props) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Requests" value="1"  />
            <Tab label="Submit transaction" value="2" style={{marginLeft:15}}  />
            <Tab label="Confirm transaction" value="3" style={{marginLeft:15}} />
            <Tab label="Mint - IDO event" value="4"style={{marginLeft:15}} />
            <Tab label="Mint - Auto allocation" value="5" style={{marginLeft:15}}/>
          </TabList>
        </Box>
          <TabPanel value="1">
            <Transactions 
              getMinterTransactions={props.getMinterTransactions}
            />
          </TabPanel>
          <TabPanel value="2">
            <SubmitTransaction 
              getRequest={props.getRequest} 
              getAllowance={props.getAllowance} 
              submit={props.submit} 
            />
          </TabPanel>
          <TabPanel value="3">
            <ConfirmTransaction 
              getRequest={props.getRequest} 
              getAllowance={props.getAllowance} 
              submit={props.submit} 
              getTransaction={props.getTransaction}
              ConfirmTransaction={props.ConfirmTransaction}
            />
          </TabPanel>
          <TabPanel value="4">
            <MintIDO 
               mintBasic={props.mintBasic}
            />
          </TabPanel>
          <TabPanel value="5">
            <MintSingle  
              mintAutoAllocationSingle={props.mintAutoAllocationSingle}
            />
          </TabPanel>
      </TabContext>
    </Box>
  );
};
