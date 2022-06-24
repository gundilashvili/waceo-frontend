
import { MinterContract } from "../abi";
import { getAddresses } from "../constants";
import Networks from "../constants/networks";
import { ethers } from "ethers";

export const getRequest = async (_address, _event) => {
    try {
        
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){    

            const minterContract = new ethers.Contract(addresses.Minter, MinterContract, provider);
            let response  
            let requestObj
            let distributionArr = []
            if(_event == "mint_basic"){
                response = await minterContract.basic_mintRequests(_address);
                const createDate = new Date(parseInt(response.createDate.toString()) * 1000)
                const formatedCreateDate = createDate.getDate() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getFullYear()
                const updateDate = new Date(parseInt(response.updateDate.toString()));
                const formatedUpdateDate = updateDate.getDate() + "/" + (updateDate.getMonth() + 1) + "/" + updateDate.getFullYear()
                requestObj = {
                    isActive: true,
                    amount: "",
                    createDate: formatedCreateDate,
                    isApproved: response.isApproved,
                    isDeclined: response.isDeclined,
                    lp: "",
                    sender: response.sender,
                    token: "",
                    updateDate: formatedUpdateDate,
                    waceoAmount: ethers.utils.formatUnits(response.amount.toString(), 'gwei'),
                }
            }else if(_event == "mint_single"){
                response = await minterContract.single_autoAllocation_mintRequests(_address);
                const createDate = new Date(parseInt(response.createDate.toString()) * 1000)
                const formatedCreateDate = createDate.getDate() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getFullYear()
                const updateDate = new Date(parseInt(response.updateDate.toString()));
                const formatedUpdateDate = updateDate.getDate() + "/" + (updateDate.getMonth() + 1) + "/" + updateDate.getFullYear()
                requestObj = {
                    isActive: true,
                    amount: "",
                    createDate: formatedCreateDate,
                    isApproved: response.isApproved,
                    isDeclined: response.isDeclined,
                    lp: "",
                    sender: "",
                    token: "",
                    updateDate: formatedUpdateDate,
                    waceoAmount: ethers.utils.formatUnits(response.amount.toString(), 'gwei'),
                }
            }else if(_event == "mint_double"){
                response = await minterContract.double_autoAllocation_mintRequests(_address);
                const createDate = new Date(parseInt(response.createDate.toString()) * 1000)
                const formatedCreateDate = createDate.getDate() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getFullYear()
                const updateDate = new Date(parseInt(response.updateDate.toString()));
                const formatedUpdateDate = updateDate.getDate() + "/" + (updateDate.getMonth() + 1) + "/" + updateDate.getFullYear()
        
        
                requestObj = {
                    isActive: true,
                    amount: ethers.utils.formatUnits(response.amount.toString(), 'gwei'),
                    createDate: formatedCreateDate,
                    isApproved: response.isApproved,
                    isDeclined: response.isDeclined,
                    lp: response.lp,
                    sender: response.sender,
                    token: response.token,
                    updateDate: formatedUpdateDate,
                    waceoAmount: ethers.utils.formatUnits(response.waceoAmount.toString(), 'gwei'),
                }
            
            }

            const lp_controller = await minterContract.LP_Controller();
            const founding_team = await minterContract.Founding_Team();
            const waceo_lp_rewards = await minterContract.WACEO_LP_Rewards();
            const waceo_operational = await minterContract.WACEO_Operational();
            const waceo_regulations = await minterContract.WACEO_Regulations();
            const waceo_dev = await minterContract.WACEO_Dev();
            const waceo_unrekt = await minterContract.WACEO_Unrekt();



        
            function calculatePercentage(value) {
                return ((parseFloat(value)/ 100) * parseFloat(requestObj.waceoAmount)).toFixed(4)
            }  

        
            distributionArr.push({
                name: "LP Controller",
                amount: calculatePercentage(ethers.utils.formatUnits(lp_controller._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(lp_controller._amount.toString(), 'gwei'),
                address: lp_controller._address,
                url: `${addresses.Block_Explorer}/address/${lp_controller._address}`
            })  
            distributionArr.push({
                name: "Founding Team",
                amount: calculatePercentage(ethers.utils.formatUnits(founding_team._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(founding_team._amount.toString(), 'gwei'),
                address: founding_team._address,
                url: `${addresses.Block_Explorer}/address/${founding_team._address}`
            })  
            distributionArr.push({
                name: "WACEO LP Rewards",
                amount: calculatePercentage(ethers.utils.formatUnits(waceo_lp_rewards._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(waceo_lp_rewards._amount.toString(), 'gwei'),
                address: waceo_lp_rewards._address,
                url: `${addresses.Block_Explorer}/address/${waceo_lp_rewards._address}`
            })
            distributionArr.push({
                name: "WACEO Operational",
                amount: calculatePercentage(ethers.utils.formatUnits(waceo_operational._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(waceo_operational._amount.toString(), 'gwei'),
                address: waceo_operational._address,
                url: `${addresses.Block_Explorer}/address/${waceo_operational._address}`
            })
            distributionArr.push({
                name: "WACEO Dev",
                amount: calculatePercentage(ethers.utils.formatUnits(waceo_dev._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(waceo_dev._amount.toString(), 'gwei'),
                address: waceo_dev._address,
                url: `${addresses.Block_Explorer}/address/${waceo_dev._address}`
            })
            distributionArr.push({
                name: "WACEO Regulations",
                amount: calculatePercentage(ethers.utils.formatUnits(waceo_regulations._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(waceo_regulations._amount.toString(), 'gwei'),
                address: waceo_regulations._address,
                url: `${addresses.Block_Explorer}/address/${waceo_regulations._address}`
            })
            distributionArr.push({
                name: "WACEO Unrekt",
                amount: calculatePercentage(ethers.utils.formatUnits(waceo_unrekt._amount.toString(), 'gwei')),
                percentage: ethers.utils.formatUnits(waceo_unrekt._amount.toString(), 'gwei'),
                address: waceo_unrekt._address,
                url: `${addresses.Block_Explorer}/address/${waceo_unrekt._address}`
            }) 
        
            return {
                success: true,
                active: response.active,
                data:  requestObj ,
                distribution: distributionArr,
                explorer: addresses.Block_Explorer
            };
        }else{
            return { success: false, message: "Wrong Network" } 
        }

    } catch (e) {
        console.log("e", e)
        return { success: false, message: e.message }
    }
}
