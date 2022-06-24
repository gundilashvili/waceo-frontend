 
import { MultisigContract } from "../abi"; 
import { getAddresses } from "../constants";  
import { ethers } from "ethers";    

export const getOwners = async () => {  
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){    
            const accounts  = await provider.listAccounts()  
            const multisigContract = new ethers.Contract(addresses.Multisig, MultisigContract, provider); 
            const response = await multisigContract.getOwners( );
            
            return {success: true, owners: response, account: accounts[0]};
        }else{
            return{success: false, message: "Wrong Network"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    } 
  
   
}
