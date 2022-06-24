import { useState, useEffect } from 'react'; 
import SearchIcon from '@mui/icons-material/Search'; 
import PerfectScrollbar from 'react-perfect-scrollbar';  
import MenuItem from '@mui/material/MenuItem'; 
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Table,
  TableBody,
  TableCell,
  TableHead, 
  TableRow,  
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  InputAdornment, 
  SvgIcon,
  Link,
  IconButton
} from '@mui/material';  
import Menu from '@mui/material/Menu'; 
import { SeverityPill } from './styles/severity-pill'; 
import CloseIcon from '@mui/icons-material/Close';


export const Transactions = (props) => {
  

    const [anchorEl, setAnchorEl] =  useState(null);
    const [filterArray, setFilterArray] = useState([]);
    const [filter, setFilter] = useState("");
    const [filterError, setFilterError] = useState("");
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => { }, filterArray)

    const handleFilterRequests = (address) => {
        setFilter(address);
      
        if(!address.length){
            setFilterArray([]);
            setFilter("");
            setFilterError("");
        }else if(address.length && !address.match(/^0x[a-fA-F0-9]{40}$/)){
            setFilterError("Wrong address"); 
        }else{
            let arr = []
            for(let i of props.requests){
                if(i.from.toLowerCase() == address.toLowerCase()){
                    arr.push(i);
                }
            }
            setFilterArray([...arr]);
            setFilterError("");
        } 
    } 

  return (
    <Container maxWidth={false}>
        <Box {...props}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1
                }}
                >
                <Typography  sx={{ m: 1, marginLeft:2 }} variant="h6"  >
                    Requests
                </Typography>
                <Box sx={{ m: 1 }}>
                    <Button  
                        sx={{ mr: 1 }} 
                        onClick={() => props.changeValue("confirmTransaction")}>
                        Confirm  
                    </Button> 
                    <Button  
                        color="primary" 
                        variant="contained"  
                        onClick={handleClick}>
                        New Request
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => {
                        handleClose()
                        props.changeValue("mintIdo") 
                        }}>IDO event</MenuItem>

                        <MenuItem onClick={() => {
                        handleClose() 
                        props.changeValue("mintSingle")
                        }}>Auto Allocation Mint</MenuItem>
                    </Menu>
                   
                </Box>
                </Box>
                <Box sx={{ mt: 3 }}>
                <Card>
                    <CardContent>
                    <Box sx={filter.length > 0 ? { maxWidth: 510 } : { maxWidth: 400 }}>
                        <TextField
                            fullWidth
                            onChange={(e) => {  
                                handleFilterRequests(e.target.value); 
                            }}
                            value={filter}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                     {filter.length < 1 && (
                                          <SvgIcon color="action" fontSize="small"  >
                                          <SearchIcon />
                                      </SvgIcon>
                                      )}
                                  
                                </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment>
                                      {filter.length > 0 && (
                                        <IconButton onClick={() => {
                                            setFilterArray([]);
                                            setFilter("");
                                            setFilterError("");
                                        }}>
                                          <CloseIcon />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  )
                            }}
                            
                            placeholder="Search request"
                            variant="outlined"
                            helperText={filterError}
                            error={filterError}
                        /> 
                    </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
        <Card > 
            <PerfectScrollbar>
                <Box sx={{ minWidth: 800 }}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>
                        SENDER
                        </TableCell>
                        <TableCell>
                        REQUEST TYPE
                        </TableCell>
                        <TableCell  >
                        WACEO Amount
                        </TableCell>
                      
                        <TableCell>
                        Date
                        </TableCell>
                        <TableCell>
                        Status
                        </TableCell>
                        <TableCell>
                        Action
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.requests && filter.length < 1&& props.requests.map((req) => (
                        <TableRow hover  key={req.details.key}  >
                            <TableCell>
                                <Link href={req.from_url} target="_blank">{req.from.slice(0,8)+"...."+req.from.slice(req.from.length-6,req.from.length)}</Link>
                            </TableCell>
                            <TableCell>
                                {req.method}
                            </TableCell>
                            <TableCell>
                                {req.waceoAmount}
                            </TableCell>
                              <TableCell>
                                {req.details.createDate}
                            </TableCell>
                            <TableCell>
                                <SeverityPill
                                    color={(req.status === 'Approved' && 'success')
                                    || (req.status === 'Declined' && 'error')
                                    || 'warning'}
                                >
                                    {req.status}
                                </SeverityPill>
                            </TableCell> 
                            <TableCell>
                                <IconButton onClick={() => {props.openRequest(req)}} >
                                    <OpenInNewIcon color="primary" />
                                </IconButton> 
                            </TableCell>
                           
                        </TableRow>
                    ))}
                    {props.requests && filterArray.length > 0 && filterArray.map((req) => (
                        <TableRow hover  key={req.details.key}  >
                            <TableCell>
                                <Link href={req.from_url} target="_blank">{req.from.slice(0,8)+"...."+req.from.slice(req.from.length-6,req.from.length)}</Link>
                            </TableCell>
                            <TableCell>
                                {req.method}
                            </TableCell>
                            <TableCell>
                                {req.waceoAmount}
                            </TableCell>
                              <TableCell>
                                {req.details.createDate}
                            </TableCell>
                            <TableCell>
                                <SeverityPill
                                    color={(req.status === 'Approved' && 'success')
                                    || (req.status === 'Declined' && 'error')
                                    || 'warning'}
                                >
                                    {req.status}
                                </SeverityPill>
                            </TableCell> 
                            <TableCell>
                                <IconButton onClick={() => {props.openRequest(req)}} >
                                    <OpenInNewIcon color="primary" />
                                </IconButton> 
                            </TableCell>
                           
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Box>
            </PerfectScrollbar> 
            </Card>
        </Box> 
    </Container>
  );
};
