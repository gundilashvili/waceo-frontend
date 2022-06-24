import { MinterContract } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers } from "ethers";    

export const mintAutoAllocationSingle= async (  _amount ) => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){   
            const signer = provider.getSigner(); 
            
            const amountInGwei = ethers.utils.parseUnits(_amount.toString(), 'gwei'); 
            
            const GAS = "5";
            let gasPrice = await provider.getGasPrice(); 
            const convertGas = ethers.utils.parseUnits(GAS, "gwei");
            gasPrice.add(convertGas); 

            const minterContract = new ethers.Contract(addresses.Minter, MinterContract, signer); 
            const txn = await minterContract.mint_auto_allocate_single(  amountInGwei, { gasPrice: gasPrice } );
    
            let txnHash = ''
            if(txn.hasOwnProperty("hash")){
                txnHash = txn.hash
            } 
            return {success: true, hash: txnHash, explorer:addresses.Block_Explorer}; 
        }else{
            return{success: false, message: "Wrong Network!"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    }  
}