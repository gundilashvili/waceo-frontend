import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material'; 
import { ChartBar as ChartBarIcon } from '../icons/chart-bar'; 
import { Lock as LockIcon } from '../icons/lock'; 
import { Logo } from './logo'; 
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArticleIcon from '@mui/icons-material/Article';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import RequestPageIcon from '@mui/icons-material/RequestPage'; 
import { NavItem } from './nav-item'; 
import { getOwners } from '../helpers' 



export const DashboardSidebar = (props) => {
 
  const [isOwner, setIsOwner] = useState(false);

  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

 


  const footerItems = [
    { 
      href: 'https://user-p.gitbook.io/waceo-technical-info/',
      icon: (<ArticleIcon fontSize="small" />),
      title: 'Docs'
    },
    {
      href: 'https://user-p.gitbook.io/waceo-technical-info/',
      icon: (<CollectionsBookmarkIcon fontSize="small" />),
      title: 'Contracts'
    },
    {
      href: 'https://user-p.gitbook.io/waceo-technical-info/',
      icon: (<AccountBalanceIcon fontSize="small" />),
      title: 'Governance'
    } 
  ];

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }

      getListOfOwners()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
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
        }else{
          setTimeout(() => {
            getListOfOwners()
          }, 2000);
        } 
      } 
    }catch(e){
      console.log(e)
    }
  }



  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
              </a>
            </NextLink>
            <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                 WACEO
                </Typography> 
          </Box> 
          
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
         
          <NavItem
            key="Dashboard"
            icon={<ChartBarIcon fontSize="small" />}
            href="/"
            title="Dashboard"
          />
          <NavItem
            key="Calculator"
            icon={<RequestPageIcon fontSize="small" />}
            href="/request"
            title="Calculator"
          />
         {isOwner == true && (
            <NavItem
              key="Requests"
              icon={<LockIcon fontSize="small" />}
              href="/admin"
              title="Requests"
            /> 
         )}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        > 
        <Box sx={{ flexGrow: 1 }}>
          {footerItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
