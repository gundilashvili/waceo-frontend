import { useState,  useEffect } from 'react';
import {  Box,  Button,  Card,  CardContent,  CardHeader, Divider, Grid, TextField, Link, Snackbar, Alert } from '@mui/material';  
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer'; 
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; 

 export const RequestDetails = (props) => {
 
  const [baseToken, setBaseToken] = useState("");
  const [tokenAddress, setTokenAddress] = useState();
  const [lpAddress, setLpAddress] = useState("");
  const [tokenAddressError, setTokenAddressError] = useState("");
  const [lpAddressError, setLpAddressError] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [allowance, setAllowance] = useState("");
  const [quote, setQuote] = useState("") ; 
  const [allowed, setAllowed] = useState(false) 
  const [isBaseToken, setIsBaseToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [submitTxn, setSubmitTxn] = useState("");
  const [blockExplorer, setBlockExplorer] = useState("");
 

  useEffect(() => {  
    fetchData()
  }, []);

  const fetchData = async () => { 
    const value = await  props.getBaseToken(); 
    if(value){
      setBaseToken(value);  
    }else{
      setAlertMessage("Wrong network!");
      setAlertSeverity("error");
    }
     
  }
 

  const handleReset = () => {
    setTokenAddress("");
    setLpAddress("");
    setTokenName("");
    setTokenSymbol("");
    setSubmitTxn("");
    setAmount("");
    setQuote("");
    setIsSubmited(false)
  }

  
  // Validations 
  const validate = () => {
    let isError = false 
    const errors = {
      tokenAddressError: '',
      lpAddressError: '', 
      amountError: ''   
    } 
    // Validate token address
    if(!(tokenAddress)) 
    {
        isError = true
        errors.tokenAddressError = 'Address is required!';  
    }else if(!tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)){
        isError = true
        errors.tokenAddressError = 'Wrong address!';
    }

    // Validate lp address
    if(!(lpAddress) && !isBaseToken) 
    {
      isError = true
      errors.lpAddressError = 'LP address is required!'; 
    }else if(!lpAddress.match(/^0x[a-fA-F0-9]{40}$/) && !isBaseToken){
      isError = true
      errors.lpAddressError = 'Wrong address!';
  }
  
    // Validate amount
    if(!(parseFloat(amount) > 0)) 
    {
        isError = true
        errors.amountError = 'Amount is required!';
    } 

    setTokenAddressError(errors.tokenAddressError)
    setLpAddressError(errors.lpAddressError)
    setAmountError(errors.amountError ) 

    return isError
  }






 
  const handleGetAllowance = async () => {
    try{
      const allowanceResponse = await props.getAllowance(tokenAddress, props.account );   
      if(allowanceResponse.success){
        let allowanceValue = parseFloat(allowanceResponse.value).toFixed(2); 
        const isAllowed =  parseFloat(allowanceResponse.value) >= parseFloat(amount) ? true : false;
        setAllowance(allowanceValue); 
        setAllowed(isAllowed); 
        setTokenSymbol(allowanceResponse.symbol);
        setTokenName(allowanceResponse.name);
      }
    }catch(e){
      console.log(e);
      setIsLoading(false);
      setAlertMessage(e.message);
      setAlertSeverity("error");
    }
  }







  const handleGetQuotes = async () => {
    try{
      const err = validate() 
      if (!err) {  
        setIsLoading(true)
        const quoteResponse = await props.getQuotes(tokenAddress, lpAddress, amount);   
        await handleGetAllowance();
        if(quoteResponse.success ){
          let quoteValue = parseFloat(quoteResponse.value).toFixed(2); 
          setQuote(quoteValue); 
          setBlockExplorer(quoteResponse.explorer)
        }else{ 
          setAlertMessage(quoteResponse.message);
          setAlertSeverity("error");
        } 
        setIsLoading(false);
      }
    }catch(e){
      console.log(e);
      setAlertMessage(e.message);
      setAlertSeverity("error");
    }
  }






  const handleSubmitRequest = async () => {
    try{ 
        setIsLoading(true);
        const submitResponse = await props.mintAutoAllocationDouble(tokenAddress, lpAddress, amount) 
        if(submitResponse.success){
          setTimeout(() => {
            setAlertMessage("Transaction confirmed!");
            setAlertSeverity("success");
            setSubmitTxn(submitResponse.hash);
            setIsSubmited(true);
            setIsLoading(false);
          }, 5000); 
        }else{
          setIsLoading(false);
          setAlertMessage(submitResponse.message);
          setAlertSeverity("error");
        }
    }catch(e){
      console.log(e);
      setIsLoading(false);
      setAlertMessage(e.message);
      setAlertSeverity("error");
    }
  } 






  const handleApproveTokens = async () => {
    try{
      setIsLoading(true); 
      const response = await props.approveTokens(tokenAddress, amount) 
      if(response.success){
        setTimeout(() => {
          setAlertMessage("Transaction confirmed!");
          setAlertSeverity("success")
          setAllowed(true); 
          setIsLoading(false);
        }, 5000);
      }else{
        setIsLoading(false);
        setAlertMessage(response.message);
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
    >
      <Card>
        
        <CardHeader
         className={isSubmited ? classes.title: ""} 
          subheader= {isSubmited ?  "": quote ? "Submit mint request to smart contract" : "Calculate estimate WACEO tokens back"  }
          title={  isSubmited ? "Successfully submitted!": quote ? "Submit request" :"Calculator"  }
        />
        <Divider />
        {quote.length < 1 ? (
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
                  label="Token address"
                  name="tokenAddress"
                  onChange={(e) => { 
                    if(e.target.value.toLowerCase().replace(/ /g,'') == baseToken.toLowerCase()){
                      setTokenAddress(e.target.value.replace(/ /g,''));
                      setTokenAddressError('');
                      setIsBaseToken(true);
                      setLpAddressError("");
                      setLpAddress(""); 
                    }else{
                      setTokenAddress(e.target.value.replace(/ /g,''));
                      setTokenAddressError('');
                      setIsBaseToken(false); 
                    }
                  }}
                  required
                  value={tokenAddress}
                  variant="outlined"
                  helperText={tokenAddressError}
                  error={tokenAddressError}
                />
              </Grid> 
              {!isBaseToken && tokenAddress && (
                <Grid
                item
                md={8}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="LP address "
                  name="lpAddress"
                  onChange={e => {
                    setLpAddress(e.target.value.replace(/ /g,''));
                    setLpAddressError() 
                  }}
                  required
                  value={lpAddress}
                  variant="outlined"
                  disabled={isBaseToken}
                  helperText={lpAddressError}
                  error={lpAddressError }
                />
              </Grid>
             )}
              <Grid
                item
                md={8}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  InputProps={{ inputProps: { min: 0 } }}
                  onChange={e => {
                    setAmount(e.target.value.replace(/ /g,''));
                    setAmountError("");
                  }}
                  type="number"
                  required
                  value={amount}
                  variant="outlined"
                  helperText={amountError}
                  error={amountError }
                  style={{marginBottom:20}}
                />
              </Grid>  
            </Grid>
          <Divider />
          </CardContent> 
        ):(
          <Card> 
            <CardContent>
             {!isSubmited ? (
              <Grid  container  spacing={3}  >
                <Grid  item md={8} xs={12}  > 
                    <TextField
                      fullWidth
                      label="Estimate WACEO tokens back"
                      name="amount"  
                      value={quote}
                      variant="outlined"  
                    /> 
                </Grid> 
              </Grid>  
             ):(
              <Grid  container  spacing={3}  >
                <Grid  item md={12} xs={12}  >  
                   <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table"> 
                      <TableBody> 
                        <TableRow> 
                          <TableCell colSpan={2}>Token address</TableCell>
                          <TableCell align="right"><Link href={blockExplorer+"address/"+tokenAddress} target="_blank">{tokenAddress}</Link> </TableCell>
                        </TableRow>
                        {lpAddress  && (
                        <TableRow>
                          <TableCell colSpan={2}>LP address</TableCell> 
                          <TableCell align="right"><Link href={(blockExplorer+"address/"+lpAddress)} target="_blank"> {lpAddress}</Link> </TableCell>
                        </TableRow>
                        )} 
                        <TableRow>
                          <TableCell colSpan={2}>Amount</TableCell>
                          <TableCell align="right">{amount}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Token name</TableCell>
                          <TableCell align="right">{tokenName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Token symbol</TableCell>
                          <TableCell align="right">{tokenSymbol}</TableCell>
                        </TableRow> 
                        <TableRow>
                          <TableCell colSpan={2}>WACEO amount</TableCell>
                          <TableCell align="right">{quote}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Recipient address</TableCell>
                          <TableCell align="right"><Link href={blockExplorer+"address/"+props.account} target="_blank">{props.account}</Link> </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Submitted transaction</TableCell>
                          <TableCell align="right"><Link href={blockExplorer+"tx/"+submitTxn} target="_blank">{submitTxn}</Link></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid> 
              </Grid>  
             )}
            </CardContent>
          </Card>
        )}
        
        {quote.length < 1 ? (
          <Box  sx={{  display: 'flex',  justifyContent: 'flex-end', p: 2 }}  > 
            <Button
              color="primary"
              variant="contained"
              onClick={handleGetQuotes} 
              disabled={isLoading}
            >
              CALCULATE
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
             {isSubmited?"CLOSE":"BACK"}  
            </Button> 
            {allowed  && !isSubmited &&  (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmitRequest} 
                  disabled={isLoading || isSubmited}
                  style={{marginLeft: 10, width:170}}
                  >
                  SUBMIT REQUEST
                </Button>  
             )} 
            {!allowed  && !isSubmited &&  (
              <Button
                color="primary"
                variant="contained"
                onClick={handleApproveTokens} 
                disabled={isLoading}
                style={{marginLeft: 10, width:170}}
              >
                APPROVE TOKENS
              </Button>  
              )} 
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