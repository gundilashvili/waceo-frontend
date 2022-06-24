 
import { ERC20 } from "../abi"; 
import { getAddresses } from "../constants";  
import { ethers } from "ethers";    
import { commas } from 'number-prettier';

export const getBalances = async ( ) => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
        if(addresses){     

            const waceo = new ethers.Contract( addresses.Waceo, ERC20, provider);  
            let responseArr = [ ["Fund", "Value"] ];
            let total = 0;
            
            for(let i of addresses.Waceo_Funds){ 
                let balance = await waceo.balanceOf(i.address.toString());
                if(balance){
                    const formattedBalance = parseInt(ethers.utils.formatUnits(balance.toString(),'gwei') );
                    total += parseFloat(ethers.utils.formatUnits(balance.toString(),'gwei'));
                    responseArr.push([
                        `${i.fund.replace(/_/g,' ')} ${commas(formattedBalance, 2)}` ,
                        formattedBalance
                    ])
                }
            } 
            const formattedTotal = commas(parseInt(total), 2);

            return {success: true, data: responseArr, total: formattedTotal };
        }else{
            return{success: false, message: "Wrong Network!"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    }  
}
