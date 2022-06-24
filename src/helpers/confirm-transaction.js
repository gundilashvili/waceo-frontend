 
import { MultisigContract } from "../abi"; 
import { getAddresses } from "../constants";  
import { ethers } from "ethers";    
 
export const ConfirmTransaction = async (_transactionId, _gasPrice, _gasLimit  ) => { 
    try{ 
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
        if(addresses){    
            const signer = provider.getSigner();  
            
            const GAS = "5";
            let gasPrice =  ethers.utils.parseUnits(_gasPrice.toString(), 'gwei');  
            const convertGas = ethers.utils.parseUnits(GAS, "gwei");
            gasPrice.add(convertGas); 
            
            let gasLimit = 200000;
            if(parseInt(_gasLimit) > gasLimit){
                gasLimit = _gasLimit;
            } 
            
            const multiSigContract = new ethers.Contract(addresses.Multisig, MultisigContract, signer); 
            const requiredConfirmation = await multiSigContract.required();
            const transactionCount  =   await multiSigContract.transactionCount();
            const txn = await multiSigContract.confirmTransaction( _transactionId,  { gasPrice: gasPrice, gasLimit: _gasLimit } );
            
            let txnHash = '';
            if(txn.hasOwnProperty("hash")){
                txnHash = txn.hash;
            } 
            return {
                success: true, 
                hash: txnHash, 
                explorer: addresses.Block_Explorer,
                transactionCount: transactionCount.toString(), 
                requiredConfirmation:requiredConfirmation.toString()
            }; 
        }else{
            return{success: false, message: "Wrong Network!"}
        }
     

    }catch(e){
        console.log(e)
        return{success: false, message: e.message}
    }  
}