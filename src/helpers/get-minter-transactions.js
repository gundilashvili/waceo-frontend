 
import { MinterContract, ERC20 } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers } from "ethers";    
import axios from "axios";
import { commas } from "number-prettier";

export const getMinterTransactions = async () => {  
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){      

            const minterContract = new ethers.Contract(addresses.Minter, MinterContract, provider);
            let transactions = []
            let txnSenders = [] 
            let items = []

            const lp_controller = await minterContract.LP_Controller();
            const founding_team = await minterContract.Founding_Team();
            const waceo_lp_rewards = await minterContract.WACEO_LP_Rewards();
            const waceo_operational = await minterContract.WACEO_Operational();
            const waceo_regulations = await minterContract.WACEO_Regulations();
            const waceo_dev = await minterContract.WACEO_Dev();
            const waceo_unrekt = await minterContract.WACEO_Unrekt();

            // Get list of transactions from Minter contract
            await axios
            .get( `https://api.covalenthq.com/v1/${addresses.ChainId}/address/${addresses.Minter}/transactions_v2/?key=${addresses.API_KEY}`)
            .then(async (res) => {  
                if (res.status == 200) {  
                    items =  res.data.data.items  
                }
            })  
            

           
            async function getAllowance(_tokenAddress, _ownerAddress){
                const tokenContract = new ethers.Contract( _tokenAddress, ERC20, provider); 
                const tokenName =  await tokenContract.name();
                const tokenSymbol =  await tokenContract.symbol();
                const decimals = await tokenContract.decimals();
                const response = await tokenContract.allowance( _ownerAddress, addresses.Minter ); 
                const balance = await tokenContract.balanceOf(_ownerAddress);
                console.log("getting balance:", tokenSymbol)
                console.log("_tokenAddress:", _tokenAddress)
                console.log("_ownerAddress:", _ownerAddress)
                const formattedBalance = parseFloat(balance.toString())/(10**decimals);
                const formatedResponse = parseFloat(response.toString())/(10**decimals);
                console.log("balanceeee:", balance.toString())
                console.log("formattedBalance:",formattedBalance)
                console.log("-----------------------------------------")
                const allowance = {
                    value: formatedResponse, 
                    name: tokenName, 
                    symbol: tokenSymbol,
                    balance: formattedBalance
                }
                return allowance;
            }

            
           



            // Format request date
            function getDate(timestamp){
                const createDate = new Date(parseInt(timestamp.toString()) * 1000)
                const formated = createDate.getDate() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getFullYear()  
                return formated;
            }

            function calculatePercentage(_value, _amount) {
                return ((parseFloat(_value)/ 100) * parseFloat(_amount)).toFixed(4)
            }  

            // Get distribution addresses and percentages 
            async function getDistribution(_waceoAmount){
                let distributionArr = [];

                distributionArr.push({
                    name: "LP Controller",
                    amount: calculatePercentage(ethers.utils.formatUnits(lp_controller._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(lp_controller._amount.toString(), 'gwei'),
                    address: lp_controller._address,
                    url: `${addresses.Block_Explorer}/address/${lp_controller._address}`
                });  
                distributionArr.push({
                    name: "Founding Team",
                    amount: calculatePercentage(ethers.utils.formatUnits(founding_team._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(founding_team._amount.toString(), 'gwei'),
                    address: founding_team._address,
                    url: `${addresses.Block_Explorer}/address/${founding_team._address}`
                }); 
                distributionArr.push({
                    name: "WACEO LP Rewards",
                    amount: calculatePercentage(ethers.utils.formatUnits(waceo_lp_rewards._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(waceo_lp_rewards._amount.toString(), 'gwei'),
                    address: waceo_lp_rewards._address,
                    url: `${addresses.Block_Explorer}/address/${waceo_lp_rewards._address}`
                });
                distributionArr.push({
                    name: "WACEO Operational",
                    amount: calculatePercentage(ethers.utils.formatUnits(waceo_operational._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(waceo_operational._amount.toString(), 'gwei'),
                    address: waceo_operational._address,
                    url: `${addresses.Block_Explorer}/address/${waceo_operational._address}`
                });
                distributionArr.push({
                    name: "WACEO Dev",
                    amount: calculatePercentage(ethers.utils.formatUnits(waceo_dev._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(waceo_dev._amount.toString(), 'gwei'),
                    address: waceo_dev._address,
                    url: `${addresses.Block_Explorer}/address/${waceo_dev._address}`
                });
                distributionArr.push({
                    name: "WACEO Regulations",
                    amount: calculatePercentage(ethers.utils.formatUnits(waceo_regulations._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(waceo_regulations._amount.toString(), 'gwei'),
                    address: waceo_regulations._address,
                    url: `${addresses.Block_Explorer}/address/${waceo_regulations._address}`
                });
                distributionArr.push({
                    name: "WACEO Unrekt",
                    amount: calculatePercentage(ethers.utils.formatUnits(waceo_unrekt._amount.toString(), 'gwei'), _waceoAmount),
                    percentage: ethers.utils.formatUnits(waceo_unrekt._amount.toString(), 'gwei'),
                    address: waceo_unrekt._address,
                    url: `${addresses.Block_Explorer}/address/${waceo_unrekt._address}`
                }); 
                return distributionArr;
            }
    
            // filter transactions 
            for(let i of items){
                if(i.hasOwnProperty("to_address")){
                    if(i.to_address){ 
                        if(i.to_address.toString().toLowerCase() == addresses.Minter.toString().toLowerCase()){
                            let isRequest  
                            if(i.hasOwnProperty("log_events")){
                                if(i.log_events.length){
                                    if(i.log_events[0].hasOwnProperty("raw_log_topics")){
                                        isRequest = true;
                                    }
                                }
                            }
                            if(isRequest){ 
                                if(!txnSenders.includes(i.from_address )){
                                    txnSenders.push(i.from_address)
                                } 
                            } 
                        } 
                    }
                }  
            }
        console.log("txnSenders", txnSenders)
            // Get request details
            for(let i of txnSenders){
                if(i.match(/^0x[a-fA-F0-9]{40}$/)){
                    const mint_basic_response = await minterContract.basic_mintRequests(i);
                    const mint_single_response = await minterContract.single_autoAllocation_mintRequests(i);
                    const mint_double_response = await minterContract.double_autoAllocation_mintRequests(i);
                    if(mint_basic_response.active){
                        const date = getDate(mint_basic_response.createDate);
                        const waceoAmount = ethers.utils.formatUnits(mint_basic_response.amount.toString(), 'gwei');
                        transactions.push({
                            status: mint_basic_response.isApproved ? "Approved" : mint_basic_response.isDeclined ? "Declined":"Pending",
                            from: i,
                            from_url: `${addresses.Block_Explorer}address/${i}`,
                            method: "IDO EVENT",
                            distribution: [],
                            waceoAmount: commas(parseFloat(waceoAmount).toFixed(2)),
                            details: {
                                key: mint_basic_response.createDate,
                                isActive: true,
                                amount: "",
                                createDate: date,
                                isApproved: mint_basic_response.isApproved,
                                isDeclined: mint_basic_response.isDeclined,
                                lp: "",
                                sender: mint_basic_response.sender,
                                token: "",
                                waceoAmount: waceoAmount,
                            }
                        })
                    }
                    if(mint_single_response.active){
                        const date = getDate(mint_single_response.createDate); 
                        const waceoAmount = ethers.utils.formatUnits(mint_single_response.amount.toString(), 'gwei');
                        const distributionDetails = await getDistribution(waceoAmount);
                        transactions.push({
                            status: mint_single_response.isApproved ? "Approved" : mint_single_response.isDeclined ? "Declined":"Pending",
                            from: i,
                            from_url: `${addresses.Block_Explorer}address/${i}`,
                            method: "AUTO ALLOCATION MINT",
                            distribution: distributionDetails,
                            waceoAmount: commas(parseFloat(waceoAmount).toFixed(2)),
                            details: { 
                                key: mint_single_response.createDate,
                                isActive: true,
                                amount: "",
                                createDate: date,
                                isApproved: mint_single_response.isApproved,
                                isDeclined: mint_single_response.isDeclined,
                                lp: "",
                                sender: "",
                                token: "", 
                                waceoAmount, 
                            }
                        })
                    }
                    if(mint_double_response.active){
                        const date = getDate(mint_double_response.createDate);
                        const waceoAmount = ethers.utils.formatUnits(mint_double_response.waceoAmount.toString(), 'gwei');
                        const distributionDetails = await getDistribution(waceoAmount);
                        const allowance = await getAllowance(mint_double_response.token,mint_double_response.sender );
                        console.log("allowance", allowance)
                        transactions.push({
                            status: mint_double_response.isApproved ? "Approved" : mint_double_response.isDeclined ? "Declined":"Pending",
                            from: i, 
                            from_url: `${addresses.Block_Explorer}address/${i}`,
                            method: "SHIELDS UP EVENT", 
                            distribution: distributionDetails,
                            waceoAmount: commas(parseFloat(waceoAmount).toFixed(2)),
                            details: {
                                allowance,
                                key: mint_double_response.createDate.toString(),
                                isActive: true,
                                amount: ethers.utils.formatUnits(mint_double_response.amount.toString(), 'gwei'),
                                createDate: date,
                                isApproved: mint_double_response.isApproved,
                                isDeclined: mint_double_response.isDeclined,
                                lp: mint_double_response.lp,
                                sender: mint_double_response.sender,
                                token: mint_double_response.token, 
                                waceoAmount,
                            } 
                        })
                    } 
                } 
            }

            console.log("TRANSACTIONS===", transactions)
            function compare( a, b ) {
                if ( a.status < b.status ){
                return 1;
                }
                if ( a.status > b.status ){
                return -1;
                }
                return 0;
            }
            
            transactions.sort( compare );
            return {success: true, explorer: addresses.Block_Explorer, transactions };
        }else{
            return{success: false, message: "Wrong Network"}
        }
    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    } 
  
   
}
