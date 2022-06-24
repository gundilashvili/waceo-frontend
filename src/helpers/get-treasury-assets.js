 
import { ERC20 } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers } from "ethers";    
import { commas } from 'number-prettier';

export const getTreasuryAssets = async ( ) => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){   

            const supportedTokensArray = addresses.Supported_Tokens;
            let responseArr = [ ["Fund", "Value"] ];
            let total = 0;

            const baseTokenContract = new ethers.Contract(addresses.Base, ERC20, provider);
            const stableTokenContract = new ethers.Contract(addresses.Stable, ERC20, provider);

            const baseTokenDecimals = await baseTokenContract.decimals();
            const baseTokenSymbol = await baseTokenContract.symbol();
            const stableTokenDecimals = await stableTokenContract.decimals();

            const baseTokenAmont = await baseTokenContract.balanceOf(addresses.Base_Stable_LP);
            const stableTokenAmont = await stableTokenContract.balanceOf(addresses.Base_Stable_LP);

            const baseTokenPriceInUSD = (stableTokenAmont/(10**stableTokenDecimals))/(baseTokenAmont /(10**baseTokenDecimals));
            
            for(let i of supportedTokensArray){
                const tokenContract = new ethers.Contract( i.tokenAddress, ERC20, provider);  

                const decimals = await tokenContract.decimals();
                const symbol =  await tokenContract.symbol();

                let balance = await tokenContract.balanceOf(addresses.Treasury);
                let _baseAmount =  await baseTokenContract.balanceOf(i.lpAddress);
                let _tokenAmount = await tokenContract.balanceOf(i.lpAddress);

                if( 
                    parseFloat(_baseAmount.toString()) > 0 && 
                    parseFloat(_tokenAmount.toString()) > 0 &&
                    parseFloat(balance.toString()) > 0 
                ){ 
                    const formattedBalance = parseFloat(balance.toString())/(10**decimals);
                    const formattedBaseAmount = parseFloat(_baseAmount.toString())/(10**baseTokenDecimals);
                    const formattedTokenAmount = parseFloat(_tokenAmount.toString())/(10**decimals);
                    
                    const tokenValueInAvax = formattedBaseAmount/formattedTokenAmount;
                    const tokenPriceInUSD = parseFloat(tokenValueInAvax*baseTokenPriceInUSD).toFixed(6);
                    const marketValueOfTokenBalance = formattedBalance*tokenPriceInUSD;
                    total = total + marketValueOfTokenBalance;
    
                    let baseFundName = `${symbol} - ${commas(parseInt(marketValueOfTokenBalance),2)} $`
                    responseArr.push([baseFundName,parseInt(marketValueOfTokenBalance) ])
                } 
            } 
            const baseTokenBalance = await baseTokenContract.balanceOf(addresses.Treasury);
            const formattedBaseTokenBalance = parseFloat(baseTokenBalance.toString())/(10**baseTokenDecimals);
            const baseTokenMarketValue = formattedBaseTokenBalance*baseTokenPriceInUSD;
            total = total + baseTokenMarketValue;
            let baseFundName = `${baseTokenSymbol} - ${commas(parseInt(baseTokenMarketValue),2)} $`
            responseArr.push([baseFundName, parseInt(baseTokenMarketValue)]);

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
