 
import { MinterContract, MultisigContract } from "../abi"; 
import { getAddresses } from "../constants"; 
import   Networks  from "../constants/networks";
import { ethers } from "ethers";    
 
export const Submit = async (_address, _event ) => { 
    try{
        const provider  = new ethers.providers.Web3Provider(window.ethereum) ; 
        const { chainId } = await provider.getNetwork(); 
        const addresses = getAddresses(chainId);
    
        if(addresses){   
        
            const signer = provider.getSigner(); 
    

            const GAS = "5";
            let gasPrice = await provider.getGasPrice(); 
            const convertGas = ethers.utils.parseUnits(GAS, "gwei");
            gasPrice.add(convertGas); 
            console.log("TYPE:", _event)
            let data
            if(_event === "mint_double"){ 
                let ABI = [ "function distribute_double_mint(address _address, bool _approve)"  ];
                let iface = new ethers.utils.Interface(ABI); 
                data =   iface.encodeFunctionData("distribute_double_mint", [ _address.toString(), true ])
                    
            }else if(_event === "mint_single"){  
            
                let ABI = [ "function distribute_single_mint(address _address, bool _approve)"  ];
                let iface = new ethers.utils.Interface(ABI); 
                data =   iface.encodeFunctionData("distribute_single_mint", [ _address.toString(), true ])
            

            }else if(_event === "mint_basic"){ 
                let ABI = [ "function distribute_basic_mint(address _address, bool _approve)"  ];
                let iface = new ethers.utils.Interface(ABI); 
                data =   iface.encodeFunctionData("distribute_basic_mint", [ _address.toString(), true ]) 
            }
            console.log("data", data)
        if(data){
            const multiSigContract = new ethers.Contract(addresses.Multisig, MultisigContract, signer); 
            const requiredConfirmation = await multiSigContract.required();
            const transactionCount  =   await multiSigContract.transactionCount();
            const txn = await multiSigContract.submitTransaction(addresses.Minter, 0 , data,  { gasPrice: gasPrice } );
        
        
        
            let txnHash = ''
            if(txn.hasOwnProperty("hash")){
                txnHash = txn.hash
            }
            
            return {
                success: true, 
                hash: txnHash, 
                explorer: addresses.Block_Explorer,
                transactionCount: transactionCount.toString(), 
                requiredConfirmation:requiredConfirmation.toString()
            }; 
        }else{
            return{success: false, message: "Couldn't encode input data"}
        }
        }else{
            return{success: false, message: "Wrong Network"}
        }

    }catch(e){
        console.log("e", e)
        return{success: false, message: e.message}
    }  
}