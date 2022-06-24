import { useState, useEffect} from 'react';
import { Box,Button, Card, CardContent, CardHeader, Divider, Grid, Link, Snackbar, Alert  } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer'; 
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';   
import TableHead from '@mui/material/TableHead';   


export const SubmitTransaction = (props) => {
 
   
  const [ isLoading, setIsLoading ] = useState(false); 
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");  
  const [transactionSubmitted, setTransactionSubmitted] = useState(false); 
   
  const [transactionCount, setTransactionCount] = useState(0);
  const [requiredConfirmations, setRequiredConfirmations] = useState(0);
  const [submissionHash, setSubmissionHash] = useState("");

   
 

  const [value, setValue] = useState('1'); 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] =  useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    console.log("SUBMIT:", props.requestDetails)
  })

 
  
  const handleSubmitTransaction = async () => {
    try{
      let type  
      let sender
      if(props.requestDetails.method == "IDO EVENT"){
        type="mint_basic";
        sender = props.requestDetails.from;
      }else if(props.requestDetails.method == "AUTO ALLOCATION MINT"){
        type="mint_single";
        sender = props.requestDetails.from;
      }else if(props.requestDetails.method == "SHIELDS UP EVENT"){
        type="mint_double"
        sender = props.requestDetails.details.sender;
      } 
      if(type && sender){
        setIsLoading(true);
        const response = await props.submit(sender, type)
        if(response.success){
         setTimeout(() => {
          setSubmissionHash(response.hash);
          setTransactionCount(response.transactionCount);
          setRequiredConfirmations(response.requiredConfirmation);
          setTransactionSubmitted(true); 
          setIsLoading(false); 
         }, 5000);
        }else{
          setIsLoading(false);
          setAlertMessage(response.message);
          setAlertSeverity("error");
        }   
      }else{
        setAlertMessage("Wrong parameters");
        setAlertSeverity("error");
      }
     
    }catch(e){
      console.log(e);
      setIsLoading(false);
      setAlertMessage(e.message);
      setAlertSeverity("error");
    } 
    
  }
 
 
  

 

  const useStyles = makeStyles(() => ({
    title: {
      color: 'green' 
    }
  }));
  const classes = useStyles();
  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
      style={{marginTop:10}}
    >
     
       
        {  !transactionSubmitted && (
          <Card>  
             <CardHeader
              className={!transactionSubmitted ? "":classes.title} 
              subheader= {!transactionSubmitted ?  "Submit transaction to multisig smart contract": ""  }
              title={  !transactionSubmitted ? "Submit Transaction": "Successfully submitted!"      }
            />
              <Divider />
           <CardContent>
             <Grid  container  spacing={3}  >
              <Grid  item md={12} xs={12}  >   
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label="Details" value="1"  />
                      {(props.requestDetails.method == "SHIELDS UP EVENT" || props.requestDetails.method == "AUTO ALLOCATION MINT") &&(
                        <Tab label="Distribution" value="2" style={{marginLeft:10}} /> 
                      )}
                    </TabList>
                  </Box>
                  <TabPanel value="1"> 
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table"> 
                      <TableBody> 
                      <TableRow>
                          <TableCell colSpan={1}>Request type</TableCell>
                          <TableCell align="right">{ props.requestDetails.method}</TableCell>
                        </TableRow> 
                        <TableRow>
                          <TableCell colSpan={1}>Status</TableCell>
                          <TableCell align="right">{ props.requestDetails.details.isApproved ? "Approved": props.requestDetails.details.isDeclined ? "Declined": "Pending"}</TableCell>
                        </TableRow> 
                        {props.requestDetails.method == "SHIELDS UP EVENT" && (
                          <TableRow> 
                            <TableCell colSpan={1}>Token name</TableCell>
                            <TableCell align="right">{props.requestDetails.details.allowance.name}</TableCell>
                          </TableRow> 
                        )}
                         {props.requestDetails.method == "SHIELDS UP EVENT" && (
                          <TableRow> 
                            <TableCell colSpan={1}>Token symbol</TableCell>
                            <TableCell align="right">{props.requestDetails.details.allowance.symbol}</TableCell>
                          </TableRow> 
                        )}
                        {props.requestDetails.method == "SHIELDS UP EVENT" && (
                          <TableRow> 
                            <TableCell colSpan={1}>Token address</TableCell>
                            <TableCell align="right"><Link href={props.blockExplorer+"address/"+props.requestDetails.details.token} target="_blank">{props.requestDetails.details.token.slice(0,6)+"..."+props.requestDetails.details.token.slice(props.requestDetails.details.token.length-4,props.requestDetails.details.token.length)}</Link> </TableCell>
                          </TableRow>
                        )}
                        {props.requestDetails.method == "SHIELDS UP EVENT" && props.requestDetails.details.lp !== "0x0000000000000000000000000000000000000000" && (
                          <TableRow>
                            <TableCell colSpan={1}>LP address</TableCell> 
                            <TableCell align="right"><Link href={props.blockExplorer+"address/"+props.requestDetails.details.lp} target="_blank">{props.requestDetails.details.lp.slice(0,6)+"..."+props.requestDetails.details.lp.slice(props.requestDetails.details.lp.length-4,props.requestDetails.details.lp.length)}</Link>  </TableCell>
                          </TableRow>
                        )} 
                        {props.requestDetails.method != "AUTO ALLOCATION MINT" && (
                          <TableRow>
                            <TableCell colSpan={1}>{props.requestDetails.method == "IDO EVENT" ? "Recipient": "Sender"}</TableCell>
                            <TableCell align="right"><Link href={props.blockExplorer+"address/"+props.requestDetails.details.sender} target="_blank">{props.requestDetails.details.sender.slice(0,6)+"..."+props.requestDetails.details.sender.slice(props.requestDetails.details.sender.length-4,props.requestDetails.details.sender.length)}</Link> </TableCell>
                          </TableRow>
                          )} 
                        {props.requestDetails.method == "SHIELDS UP EVENT" && (
                        <TableRow>
                          <TableCell colSpan={1}>Amount</TableCell>
                          <TableCell align="right">{props.requestDetails.waceoAmount}</TableCell>
                        </TableRow> 
                         )} 
                        <TableRow>
                          <TableCell colSpan={1}>WACEO amount</TableCell>
                          <TableCell align="right">{props.requestDetails.details.waceoAmount}</TableCell>
                        </TableRow>  
                        {props.requestDetails.method == "SHIELDS UP EVENT" && (
                          <TableRow>
                            <TableCell colSpan={1}>Minter contract allowance</TableCell>
                            <TableCell align="right">{props.requestDetails.details.allowance.value}</TableCell>
                          </TableRow> 
                        )}
                        <TableRow>
                          <TableCell colSpan={1}>Request date</TableCell>
                          <TableCell align="right">{props.requestDetails.details.createDate}</TableCell>
                        </TableRow> 
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </TabPanel>
                  <TabPanel value="2">
                    {props.requestDetails.distribution.length > 0  && (
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Distribution</TableCell>
                              <TableCell align="right">Percentage</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="right">Address</TableCell> 
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            { props.requestDetails.distribution.map((row) => (
                              <TableRow  key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}  >
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right">{row.percentage}%</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                <TableCell align="right"><Link href={row.url} target="_blank">{row.address.slice(0,6)+"..."+row.address.slice(row.address.length-4,row.address.length)}</Link></TableCell> 
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )} 
                  </TabPanel>  
                </TabContext> 
              </Grid> 
            </Grid>  
          </CardContent>
         
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          > 
           <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    props.changeValue("requests");
                  }} 
                  disabled={isLoading}
                  style={{marginTop:6}}
                >
                 CLOSE
           </Button>  
           <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmitTransaction} 
                  disabled={isLoading || props.requestDetails.details.isApproved}
                  style={{marginTop:6, marginLeft:5}}
                >
                 SUBMIT TRANSACTION
           </Button>  
          </Box> 
        </Card>
      )} 

      { transactionSubmitted && (
         <Card> 
          <CardHeader
            className={ classes.title }  
            title={  "Successfully submitted!" }
          />
          <Divider /> 
          <Grid  container  spacing={3}  >
            <Grid  item md={12} xs={12}  >  
              <TableContainer component={Paper} style={{marginTop:30 }}>
                <Table sx={{ minWidth: 700 }} style={{marginBottom:10}} aria-label="spanning table"> 
                  <TableBody>   
                    <TableRow> 
                      <TableCell colSpan={2}>Transaction ID</TableCell>
                      <TableCell align="right">{parseFloat(transactionCount)} </TableCell>
                    </TableRow>  
                    <TableRow> 
                      <TableCell colSpan={2}>Transaction confirmations</TableCell>
                      <TableCell align="right">1</TableCell>
                    </TableRow>  
                    <TableRow> 
                      <TableCell colSpan={2}>Required confirmations</TableCell>
                      <TableCell align="right">{requiredConfirmations}</TableCell>
                    </TableRow>   
                    <TableRow> 
                      <TableCell colSpan={2}>Transaction hash</TableCell>
                      <TableCell align="right"><Link href={props.blockExplorer + "/tx/"+{submissionHash}} target="_blank">{submissionHash}</Link></TableCell>
                    </TableRow>  
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid> 
          </Grid>  

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 1
            }}
          > 
           <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    props.changeValue("requests");
                  }} 
                  disabled={isLoading}
                  style={{marginTop:6}}
                >
                 CLOSE
           </Button>   
          </Box> 
        </Card>
      )} 
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
    </form>
  );
};
