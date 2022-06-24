 
import { MultisigContract } from "../abi"; 
import { getAddresses } from "../constants";  
import { ethers } from "ethers";    

export const getTransaction = async (transactionId) => {  
    try{

        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){    
            const accounts  = await provider.listAccounts()  
            const account = accounts[0]
             
            const multisigContract = new ethers.Contract(addresses.Multisig, MultisigContract, provider); 
            const isConfirmed = await multisigContract.isConfirmed(transactionId);
            const confirmationCount = await multisigContract.getConfirmationCount(transactionId);
            const required = await multisigContract.required();
            const confirmations = await multisigContract.getConfirmations(transactionId);
            
            
            let gasPrice = await provider.getGasPrice(); 
            let formatedGasPrice  =  ethers.utils.formatUnits(gasPrice.toString(),'gwei');  
            let userConfirmation = false;
            for(let i of confirmations){
                if(i.toLowerCase() === account.toLowerCase()){
                    userConfirmation=true;
                }
            }
            return {
                success: true,
                isConfirmed, 
                confirmationCount:confirmationCount.toString(), 
                required:required.toString(), 
                gasPrice: formatedGasPrice,
                confirmations,
                userConfirmation
            };
        }else{
            return{success: false, message: "Wrong Network"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    } 
  
   
}
