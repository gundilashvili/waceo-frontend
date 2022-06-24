  
import { getAddresses } from "../constants" 
import { ethers } from "ethers";  

export const getBaseToken = async () => { 
    const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
    const { chainId } = await provider.getNetwork(); 
    const addresses = getAddresses(chainId);

    if(addresses){      
        const baseToken = addresses.Base;
        return baseToken;
    }else{
        return null;
    }
  
}
