import { useState,  useEffect } from 'react';
import {  Box,  Button,  Card,  CardContent,  CardHeader, Divider, Grid, TextField, Link, Snackbar, Alert } from '@mui/material';  
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer'; 
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; 

 export const MintIDO = (props) => {
  
  const [recipientAddress, setRecipientAddress] = useState(""); 
  const [waceoAmount, setWaceoAmount] = useState(); 
  const [submitted, setSubmitted] = useState(false); 
  
  const [recipientAddressError, setRecipientAddressError] = useState(false); 
  const [waceoAmountError, setWaceoAmountError] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(""); 
  const [alertSeverity, setAlertSeverity] = useState(""); 
  const [blockExplorer, setBlockExplorer] = useState(""); 
  const [submitTxn, setSubmitTxn] = useState(false); 
    


  useEffect(() => {  
  
  }, []);

  

  const handleReset = () => {
    setRecipientAddress('');
    setWaceoAmount(false);
    setSubmitted(false);
    setBlockExplorer("");
    setSubmitTxn("");
    props.changeValue("requests");
  }

  
  // Validations 
  const validate = () => {
    let isError = false 
    const errors = {
      waceoAmountError: '',
      recipientAddressError: '', 
      amountError: ''   
    } 
    // Validate   address
    if(!(recipientAddress)) 
    {
        isError = true
        errors.recipientAddressError = 'Recipient address is required!';  
    }else if(!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)){
        isError = true
        errors.recipientAddressError = 'Wrong address!';
    } 
    // Validate amount
    if(!(parseFloat(waceoAmount) > 0)) 
    {
        isError = true
        errors.waceoAmountError = 'Amount is required!';
    } 

    setRecipientAddressError(errors.recipientAddressError)
    setWaceoAmountError(errors.waceoAmountError)

    return isError
  }
  

  const handleSubmitRequest = async () => {
    try{ 

        const err = validate() 
        if (!err) {  
            setIsLoading(true);
            const submitResponse = await props.mintBasic(recipientAddress,waceoAmount) 
            if(submitResponse.success){
                setTimeout(() => {
                    setAlertMessage("Transaction confirmed!");
                    setAlertSeverity("success"); 
                    setBlockExplorer(submitResponse.explorer);
                    setIsLoading(false);
                    setSubmitted(true);
                    setSubmitTxn(submitResponse.hash)
                }, 5000); 
            }else{
              setIsLoading(false);
              setAlertMessage(submitResponse.message);
              setAlertSeverity("error");
            }
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
    >
      <Card>
        
        <CardHeader
        className={submitted ? classes.title: ""} 
        subheader= {submitted ?  "": "Submit request to smart contract"  }
        title={  submitted ? "Successfully submitted!":   "IDO event"   }
        />
        <Divider />
        {!submitted ? (
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
                  label="Recipient address"
                  name="recipientAddress"
                  onChange={(e) => {  
                      setRecipientAddress(e.target.value.replace(/ /g,''));
                      setRecipientAddressError(''); 
                  }}
                  required
                  value={recipientAddress}
                  variant="outlined"
                  helperText={recipientAddressError}
                  error={recipientAddressError}
                />
              </Grid>  
              <Grid
                item
                md={8}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="WACEO amount"
                  name="amount"
                  InputProps={{ inputProps: { min: 0 } }}
                  onChange={e => {
                    setWaceoAmount(e.target.value.replace(/ /g,''));
                    setWaceoAmountError("");
                  }}
                  type="number"
                  required
                  value={waceoAmount}
                  variant="outlined"
                  helperText={waceoAmountError}
                  error={waceoAmountError }
                  style={{marginBottom:20}}
                />
              </Grid>  
            </Grid>
          <Divider />
          </CardContent> 
        ):( 
          <Card> 
            <CardContent> 
              <Grid  container  spacing={3}  >
                <Grid  item md={12} xs={12}  >  
                   <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table"> 
                      <TableBody> 
                        <TableRow>
                          <TableCell colSpan={2}>WACEO amount</TableCell>
                          <TableCell align="right">{waceoAmount}</TableCell>
                        </TableRow> 
                        <TableRow> 
                          <TableCell colSpan={2}>Recipient address</TableCell>
                          <TableCell align="right"><Link href={blockExplorer+"address/"+recipientAddress} target="_blank">{recipientAddress}</Link> </TableCell>
                        </TableRow> 
                        <TableRow>
                          <TableCell colSpan={2}>Transaction</TableCell>
                          <TableCell align="right"><Link  href={blockExplorer+"tx/"+submitTxn} target="_blank">{submitTxn}</Link></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid> 
              </Grid>   
            </CardContent>
          </Card> 
        )}
        
        {!submitted ? (
          <Box  sx={{  display: 'flex',  justifyContent: 'flex-end', p: 2 }}  > 
           <Button
              color="primary"
              variant="outlined"
              onClick={handleReset} 
              disabled={isLoading}
            >
              CLOSE
            </Button> 
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmitRequest} 
              disabled={isLoading}
              style={{marginLeft: 8}}
            >
              SUBMIT REQUEST
            </Button> 
          </Box>
        ): (
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