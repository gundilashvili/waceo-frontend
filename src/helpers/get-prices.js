 
import {WaceoContract, MinterContract, ERC20 } from "../abi"; 
import { getAddresses } from "../constants" 
import { ethers } from "ethers"; 
import { format } from 'number-prettier';


export const getPrices = async () => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
        if(addresses){ 
            const waceoContract = new ethers.Contract(addresses.Waceo, WaceoContract, provider);
            const minterContract = new ethers.Contract(addresses.Minter, MinterContract, provider);
           
            const totalSupply = await waceoContract.totalSupply();
            const formatedTotalSupply = format(totalSupply/(10**9), 2);
           
            const waceoPriceInAvax = await minterContract.waceoValueInBaseToken();
            const formatedWaceoPriceInAvax = waceoPriceInAvax/(10**9);
           
           
            const baseTokenContract = new ethers.Contract(addresses.Base, ERC20, provider);
            const stableTokenContract = new ethers.Contract(addresses.Stable, ERC20, provider);
            
            const baseTokenDecimals = await baseTokenContract.decimals();
            const stableTokenDecimals = await stableTokenContract.decimals();
        
            const baseTokenAmont = await baseTokenContract.balanceOf(addresses.Base_Stable_LP);
            const stableTokenAmont = await stableTokenContract.balanceOf(addresses.Base_Stable_LP);
        
            const avaxPriceInUSD = (stableTokenAmont/(10**stableTokenDecimals))/(baseTokenAmont /(10**baseTokenDecimals));
            const waceoPriceInUSD =  avaxPriceInUSD*formatedWaceoPriceInAvax; 
            const formatedWaceoPriceInUSD =  waceoPriceInUSD.toFixed(4);
            const indicator = addresses.EUR_USD_Indicator;
            const waceoPriceInEUR = parseFloat(waceoPriceInUSD)*parseFloat(indicator);
            const formatedWaceoPriceInEUR = waceoPriceInEUR.toFixed(4);
          
            const prices = {
                waceoPriceInUsd: formatedWaceoPriceInUSD,
                waceoPriceInEur: formatedWaceoPriceInEUR,
                waceoPriceInAvax: formatedWaceoPriceInAvax,
                waceoTotalSupply: formatedTotalSupply
            }
          
            return prices;
        }else{
            return null;
        }
       
    }catch(e){
        console.log(e)
    } 
}
