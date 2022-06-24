 
import { MinterContract } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers } from "ethers";    

export const getQuotes = async (_tokenAddress, _lpAddress, _amount) => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){    
            const amountInGwei = ethers.utils.parseUnits(_amount.toString(), 'gwei'); 
            let lp = _lpAddress ? _lpAddress : "0x0000000000000000000000000000000000000000"
            
            const minterContract = new ethers.Contract(addresses.Minter, MinterContract, provider); 
            const response = await minterContract.waceoValueByToken(_tokenAddress, lp, amountInGwei );
           
            let formatedResponse =  ethers.utils.formatUnits(response.toString(),'gwei');  
            return {success: true, value: formatedResponse, explorer: addresses.Block_Explorer};
        }else{
            return{success: false, message: "Wrong Network"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    }  
}
