import React, { useState, useEffect, createContext} from 'react'; 
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import SupportedNetworks from '../constants/networks';


export const Web3Context = createContext(); 

export const Web3Provider = props => {
     
    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [network, setNetwork] = useState();
    const [message, setMessage] = useState("");
    const [signedMessage, setSignedMessage] = useState("");
    const [verified, setVerified] = useState();

    let web3Modal  
    if (typeof window !== 'undefined') {
        web3Modal = new Web3Modal({ 
        cacheProvider: true,
        providerOptions, // required
        })
    }

    
    const connectWallet = async () => {
        try { 
            if (window.ethereum) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: ethers.utils.hexlify(43113)}],
                    });
                    const provider = await web3Modal.connect();  
                    const library = new ethers.providers.Web3Provider(provider); 
                    const accounts = await library.listAccounts(); 
                    const network = await library.getNetwork(); 
                    if(network.chainId === SupportedNetworks.AVAX_FUJI ){  
                        setProvider(provider);
                        setLibrary(library);
                        if (accounts) setAccount(accounts[0]);
                        setChainId(network.chainId); 
                    }  
                    
                } catch (error) { 
                  console.error(error);
                }
              }
           
             
        } catch (error) {
        setError(error);
        }
    };
 
    const refreshState = () => {
        setAccount();
        setChainId();
        setNetwork("");
        setMessage("");
        setSignature("");
        setVerified(undefined);
        window.location.reload()
    };

    const disconnect = async () => {
        if(provider.close) {
            await provider.close();
        }
        await web3Modal.clearCachedProvider();
        refreshState();
    };

    
    
    useEffect(() => {  
        connectWallet(); 
    }, []);

    useEffect(() => {
        if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
            console.log("accountsChanged", accounts);
            if (accounts) setAccount(accounts[0]);
        };

        const handleChainChanged = (_hexChainId) => {
            setChainId(_hexChainId);
            window.location.reload();
        };

        const handleDisconnect = () => {
            console.log("disconnect", error);
            disconnect();
        };

        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);

        return () => {
            if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("disconnect", handleDisconnect);
            }
        };
        }
    }, [provider]);

    return  <Web3Context.Provider 
                value={{
                connectWallet: connectWallet,
                disconnect: disconnect,
                provider: provider,
                library: library,
                account: account,
                network: network
            }}
            >
                {props.children}
            </Web3Context.Provider> 
}