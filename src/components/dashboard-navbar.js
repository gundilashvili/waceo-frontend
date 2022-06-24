import { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar,  Box, IconButton, Toolbar, Tooltip , Button, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; 
import { Web3Context } from '../web3/web3Context';

 
const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => { 

  const { onSidebarOpen, ...other } = props;  
  const {account, connectWallet, disconnect } = useContext(Web3Context); 
  
   
 
  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton> 
          
          <Box sx={{ flexGrow: 1 }} />

          {account && ( 
            <Typography color="primary">{account.slice(0,6)+"..."+account.slice(account.length-4,account.length)} &nbsp;</Typography> 
          )} 
          {!account ? ( 
              <Button color="primary"  variant="outlined" onClick={connectWallet}>Connect Wallet</Button> 
          ) : (  
            <Button color="primary"  variant="outlined" onClick={disconnect}>Disconnect</Button> 
          )}
              
           
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
