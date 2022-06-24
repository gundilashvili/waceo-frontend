 
import { ERC20 } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers } from "ethers";    

export const getAllowance = async ( _tokenAddress, _ownerAddress ) => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
        if(addresses){     
            const tokenContract = new ethers.Contract( _tokenAddress, ERC20, provider); 
            const tokenName =  await tokenContract.name();
            const tokenSymbol =  await tokenContract.symbol();
            const decimals = await tokenContract.decimals();
            const response = await tokenContract.allowance( _ownerAddress, addresses.Minter ); 
            const formatedResponse = parseFloat(response.toString())/10**decimals;
            return {success: true, value: formatedResponse, name: tokenName, symbol: tokenSymbol};
        }else{
            return{success: false, message: "Wrong Network!"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    }  
}
