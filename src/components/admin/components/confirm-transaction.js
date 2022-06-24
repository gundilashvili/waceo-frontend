import { useState, useEffect} from 'react';
import { Box,Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Snackbar, Alert, Link } from '@mui/material';
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



export const ConfirmTransaction = (props) => {
 
  
  const [transactionId, setTransactionId ] = useState();
  const [transactionIdError, setTransactionIdError ] = useState("");
  const [transactionDetails, setTransactionDetails ] = useState(false);
  const [submitted,setSubmitted ] = useState(false);
  const [isLoading,setIsLoading ] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); 
  const [blockExplorer, setBlockExplorer] = useState("");
  const [isConfirmed, setIsConfirmed] = useState();
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [required, setRequired] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [gasPriceError, setGasPriceError] = useState("");
  const [gasLimit, setGasLimit] = useState(0);
  const [gasLimitError, setGasLimitError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [userConfirmation, setUserConfirmation ] = useState(false); 
  const [confirmationAddresses, setConfirmationAddresses] = useState([])
  
  const [value, setValue] = useState('1'); 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  useEffect(() => { 
    
  },[ confirmationAddresses]);


  // Validations 
  const validate = () => {
    let isError = false 
    const errors = {
      transactionIdError: ''   
    }   
    // Validate id
    if(!(parseFloat(transactionId) > 0)) 
    {
        isError = true
        errors.transactionIdError = 'Transaction ID is required!';
    }
    setTransactionIdError(errors.transactionIdError)  
    return isError
  } 




  const handleReset = () => {
    setSubmitted(false);
    setTransactionDetails(false);
    setTransactionId("");
    props.changeValue("requests");
  }





// Validations 
const validateGas = () => {
  let isError = false 
  const errors = {
    gasLimitError: '',
    gasPriceError   
  }   
  // Validate id
  if(!(parseFloat(gasPrice) > 0)) 
  {
      isError = true
      errors.gasPriceError = 'Gas price is required!';
  }
  // Validate id
  if((!parseFloat(gasLimit)) > 0 &&  parseFloat(gasLimit) < 10000) 
  {
      isError = true
      errors.gasLimitError = 'Gas limit is required!';
  }
  setGasLimitError(errors.gasLimitError)  
  setGasPriceError(errors.gasPriceError)  
  return isError
}
 





  const handleConfirmTransaction = async () => {
    try{

      const err = validateGas() 
      if (!err) { 
        setIsLoading(true);
        const response = await props.ConfirmTransaction(transactionId, gasPrice, gasLimit)
        if(response.success){
         setTimeout(() => {
          setSubmitted(true)
          setBlockExplorer(response.explorer);
          setTransactionHash(response.hash)
          setIsLoading(false)
         }, 5000);
        }else{
          setIsLoading(false);
          setAlertMessage(response.message);
          setAlertSeverity("error");
        }
      }
    }catch(e){
      console.log(e)
      setIsLoading(false);
      setAlertMessage(e.message);
      setAlertSeverity("error");
    }
  }






 const  handleFindTransaction = async () => {
    try{

      const err = validate() 
      if (!err) { 
        setIsLoading(true);
        const response = await props.getTransaction(transactionId)
   
        if(response.success){  
          if(parseInt(response.confirmationCount) < 1){
            setIsLoading(false);
            setTransactionIdError("Couldn't find transaction")
          }else{
            if((parseFloat(response.required)-parseFloat(response.confirmationCount)) == 1) {
              const doubleGasPrice = parseFloat(response.gasPrice) * 2 
              setGasLimit(500000);
              setGasPrice(doubleGasPrice)
            } 
            setConfirmationAddresses( [  ...response.confirmations]);
            setUserConfirmation(response.userConfirmation);
            setTransactionDetails(true);
            setIsLoading(false); 
            setIsConfirmed(response.isConfirmed);
            setConfirmationCount(response.confirmationCount);
            setRequired(response.required); 
          }
          
        }else{  
          setIsLoading(false);
          setAlertMessage(response.message);
          setAlertSeverity("error"); 
        } 
      }
    }catch(e){
      console.log(e)
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
    >
      <Card> 
        <CardHeader 
            subheader= {"Submit approval to multisig contract"}
            title={"Confirm transaction"}
          />
        <Divider />
        {!transactionDetails  && (
            <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={8}
                xs={12}
              >
                <TextField
                  fullWidth 
                  label="Transaction ID"
                  name="transactionid"
                  onChange={(e) => {  
                      setTransactionId(e.target.value.replace(/ /g,''));
                      setTransactionIdError(''); 
                  }}
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                  type="number"
                  value={transactionId}
                  variant="outlined"
                  helperText={transactionIdError}
                  error={transactionIdError}
                />
              </Grid>  
            </Grid> 
          </CardContent>  
        )}
        {transactionDetails && !submitted && ( 
           <Card  style={{marginTop:20, marginLeft:10}}>  
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label="Details" value="1"  />  
                      <Tab label="Gas estimation" value="2" style={{marginLeft:10}} />  
                    </TabList>
                  </Box>
                  <TabPanel value="1"> 
                  <CardContent> 
                      <Grid  container  spacing={3}  >
                        <Grid  item md={12} xs={12}  >  
                            <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="spanning table">  
                              <TableHead>
                                <TableRow>
                                  <TableCell>Overview</TableCell> 
                                  <TableCell></TableCell> 
                                  <TableCell></TableCell> 
                                </TableRow>
                              </TableHead>  
                              <TableBody> 
                                <TableRow>
                                  <TableCell colSpan={2}>Transaction ID</TableCell>
                                  <TableCell align="right">{transactionId}</TableCell>
                                </TableRow> 
                                <TableRow>
                                  <TableCell colSpan={2}>Executed</TableCell>
                                  <TableCell align="right">{isConfirmed ? "YES":"NO"}</TableCell>
                                </TableRow> 
                                <TableRow> 
                                  <TableCell colSpan={2}>Confirmations</TableCell>
                                  <TableCell align="right">{confirmationCount} </TableCell>
                                </TableRow> 
                                <TableRow>
                                  <TableCell colSpan={2}>Required confirmations</TableCell>
                                  <TableCell align="right">{required}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid> 
                      </Grid>   
                      <Grid  container  spacing={3} style={{marginTop:5}} >
                          <Grid  item md={12} xs={12}  >  
                              <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                 <TableHead>
                                    <TableRow>
                                      <TableCell>Confirmed by</TableCell> 
                                    </TableRow>
                                  </TableHead> 
                                <TableBody>  
                                { confirmationAddresses.map((_address) => (
                                  <TableRow> 
                                    <TableCell ><Link href={blockExplorer+"address/"+_address} target="_blank">{_address}</Link> </TableCell>
                                  </TableRow>  
                                ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid> 
                        </Grid>   
                    </CardContent>
                  </TabPanel> 
                  <TabPanel value="2">
                  <Grid
                      style={{marginTop:10}}
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={8}
                        xs={12}
                      >
                        <TextField
                          fullWidth 
                          label="Gas price"
                          name="gasprice"
                          onChange={(e) => {  
                              setGasPrice(e.target.value.replace(/ /g,''));
                              setGasPriceError(''); 
                          }}
                          required
                          InputProps={{ inputProps: { min: 0 } }}
                          type="number"
                          value={gasPrice}
                          variant="outlined"
                          helperText={gasPriceError}
                          error={gasPriceError}
                        />
                      </Grid>
                      <Grid
                        item
                        md={8}
                        xs={12}
                      >
                        <TextField
                          fullWidth 
                          label="Gas Limit"
                          name="gasLimit"
                          disabled={parseFloat(gasLimit)==0}
                          onChange={(e) => {  
                              setGasLimit(e.target.value.replace(/ /g,''));
                              setGasLimitError(''); 
                          }}
                          required
                          InputProps={{ inputProps: { min: 0 } }}
                          type="number"
                          value={gasLimit}
                          variant="outlined"
                          helperText={gasLimitError}
                          error={gasLimitError}
                        />
                      </Grid>
                      </Grid>
                  </TabPanel>  
                </TabContext> 
          
           <Box  sx={{  display: 'flex',  justifyContent: 'flex-end', p: 2 }}  > 
            <Button
                color="primary"
                variant="outlined"
                onClick={handleReset} 
                disabled={isLoading}
                style={{width:120}}
              >
              CLOSE   
            </Button>  
            <Button
              color="primary"
              variant="contained"
              onClick={handleConfirmTransaction} 
              disabled={isLoading || isConfirmed || userConfirmation}
              style={{width:120, marginLeft: 8}}
            >
             CONFIRM    
            </Button>  
          </Box> 
         </Card> 
        )}

        {submitted && (
           <Card> 
          <CardHeader
            className={submitted ? classes.title: ""}  
            title={ "Successfully submitted!"  }
            />
           <CardContent> 
             <Grid  container  spacing={3}  >
               <Grid  item md={12} xs={12}  >  
                  <TableContainer component={Paper}>
                   <Table sx={{ minWidth: 700 }} aria-label="spanning table"> 
                     <TableBody> 
                       <TableRow>
                         <TableCell colSpan={2}>Transaciton ID </TableCell>
                         <TableCell align="right">{transactionId}</TableCell>
                       </TableRow> 
                       <TableRow> 
                         <TableCell colSpan={2}>Transaction</TableCell>
                         <TableCell align="right"><Link href={blockExplorer+"tx/"+transactionHash} target="_blank">{transactionHash}</Link> </TableCell>
                       </TableRow>  
                     </TableBody>
                   </Table>
                 </TableContainer>
               </Grid> 
             </Grid>   
           </CardContent>  
         </Card> 
        )}
        
        { submitted  && 
          <Box  sx={{  display: 'flex',  justifyContent: 'flex-end', p: 2 }}  > 
            <Button
              color="primary"
              variant="outlined"
              onClick={handleReset} 
              disabled={isLoading}
              style={{width:120}}
            >
            CLOSE  
            </Button>  
          </Box> 
        } 
        {!transactionDetails && (
          <div style={{marginTop:10}}>
            <Divider /> 
            <Box  sx={{  display: 'flex',  justifyContent: 'flex-end', p: 2 }}  > 
              
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handleReset} 
                  disabled={isLoading}
                  style={{marginTop:6}}
                >
                 CLOSE
                </Button>  
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleFindTransaction} 
                  disabled={isLoading}
                  style={{marginTop:6, marginLeft:5}}
                >
                  FIND TRANSACTION
                </Button>  
              </Box>
            </div>
        )}

      </Card>
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
