 
import { ERC20 } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers, BigNumber } from "ethers";    

export const approveTokens = async ( _token, _amount ) => { 
    try{   
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
        if(addresses){  
            const signer = provider.getSigner();     

            const tokenContract = new ethers.Contract(_token, ERC20,  signer); 
            const decimals = await tokenContract.decimals()
        
            const bigNum = BigNumber.from(_amount).mul(BigNumber.from(10).pow(decimals));
            const GAS = "5";
            let gasPrice = await provider.getGasPrice(); 
            const convertGas = ethers.utils.parseUnits(GAS, "gwei");
            gasPrice.add(convertGas); 

            const txn = await tokenContract.approve( addresses.Minter, bigNum, { gasPrice: gasPrice })
            let txnHash = ''
            if(txn.hasOwnProperty("hash")){
                txnHash = txn.hash
            }
            return {success: true, hash: txnHash};
        }else{
            return {success: true, message: "Wrong Network!"};
        } 
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    }  
}
