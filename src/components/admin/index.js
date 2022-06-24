import { useState, useEffect } from 'react';
import { Transactions } from './components/transactions';
import { SubmitTransaction } from './components/submit-transaction';
import { ConfirmTransaction } from './components/confirm-transaction';
import { MintIDO } from './components/mint-ido';
import { MintSingle } from './components/mint-single'; 
import { Container, Snackbar, Alert} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const Multisig = (props) => {

    const [requests, setRequests] = useState([]);  
    const [isLoading, setIsLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [value, setValue] = useState('requests');
    const [targetRequest, setTargetRequest] = useState({});
    const [blockExplorer, setBlockExplorer] = useState("");
    
    const handleChangeValue = (newValue) => {
        setValue(newValue);
    };

    useEffect(() => {  
        fetchTransacitons();
    },[]);
 

    useEffect(() => {
        handleChangeValue('requests');
    }, [requests]);


    useEffect(() => { 
    }, [targetRequest]);


    const handleOpenRequest = (_request) => { 
        setTargetRequest(_request);
        setValue("submitRequests"); 
    }
 
    
    const fetchTransacitons = async () => {
        try{ 
          const response = await props.getMinterTransactions();
          setIsLoading(false);
          if(response.success){ 
              setRequests(response.transactions); 
              setBlockExplorer(response.explorer);
          }else{ 
            setAlertMessage(response.message);
            setAlertSeverity("error");
          } 
        
        }catch(e){
          setAlertMessage(response.message);
          setAlertSeverity("error");
            console.log(e)
        }
    }

  return (
    <div >
        {value == "requests" && (
            <Transactions 
                requests={requests} 
                changeValue={handleChangeValue}
                openRequest={handleOpenRequest}
            />
        )}
        {value == "submitRequests" && ( 
            <Container >
                <SubmitTransaction 
                    changeValue={handleChangeValue}
                    requestDetails={targetRequest}
                    blockExplorer={blockExplorer}
                    submit={props.submit}
                />
            </Container>
        )}
        {value == "confirmTransaction" && (
            <Container >
                <ConfirmTransaction 
                    getTransaction={props.getTransaction} 
                    changeValue={handleChangeValue}
                    ConfirmTransaction={props.ConfirmTransaction}
                />
            </Container>
        )}
        {value == "mintIdo" && (
            <Container >
                 <MintIDO  
                    mintBasic={props.mintBasic} 
                    changeValue={handleChangeValue}
            />
            </Container> 
        )}
        {value == "mintSingle" && (
            <Container >
                <MintSingle  
                    changeValue={handleChangeValue}
                    mintAutoAllocationSingle ={props.mintAutoAllocationSingle }/>
            </Container>  
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


        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading} 
        >
            <CircularProgress color="primary" />
        </Backdrop>
       
    </div>
  );
};
