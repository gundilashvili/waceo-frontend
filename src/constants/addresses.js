import Networks from "./networks";

const AVAX_FUJI = {
    ChainId: "43113",
    EUR_USD_Indicator: 0.94,
    API_KEY: "ckey_6b953d6c14fb44b78ced9f2b439",
    Waceo: "0xa9079D37a06894E8Ed2a6E5Fb20E500d6a57563d",
    Minter: "0x2C7fF5bBbBa4312850CeA6BD05ab46A25414a0A6",
    Multisig: "0x84A9D2A30b249dC72341A509B4Cd256337F901AE",
    Treasury: "0xb6885E6acE101564A4a612142B13976fAC5C25AA",
    Base: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    Stable: "0x5F15cFFFf8C909dB43c894C41Fe75710f7A51637", 
    Base_Stable_LP: "0x4F8DB745D919A2d8DF4B0EF4BA3ac5960Ad190B6",
    Block_Explorer: "https://testnet.snowtrace.io/",
    Supported_Tokens: [ 
        {
            tokenAddress: "0x66E64230bA6b7704Fe3bE1D7FB1b7e8E059F82cd",
            lpAddress: "0xc93b4B15457577F110D09f9f7fbf86FCdEc8AC58"
            
        },
        {
            tokenAddress: "0xe7BCC4637913267ECFC74c10E915386464ec018b",
            lpAddress: "0xD3E05FB480E18f26180617c17B639C578f409174"
        },
        
    ],
    Waceo_Funds: [
        {
            fund: "LP_Controller",
            address: "0x906e0F4404492cDB8B34757d4FfcC19C349cC46a",
        },
        {
            fund: "Founding_Team",
            address: "0xb4BB0C2DA717FbC8B2CC6E668374b35473Eccc01",
        },
        {
            fund: "WACEO_LP_Rewards",
            address: "0xcb47599FA8fD49A6F74fB8B3d9A4474aA834d64b",
        },
        {
            fund: "WACEO_Operational",
            address: "0x75E1B5daC249256e448631655C441dC7478Cf5e5",
        },
        {
            fund: "WACEO_Dev",
            address: "0xB39EBF4890E0E2fa14CE17A64bec2188fb62ECcc",
        },
        {
            fund: "WACEO_Regulations",
            address: "0x6703D075893062014304AB3ca76e92B952638151",
        },
        {
            fund: "WACEO_Unrekt",
            address: "0x51526432f49e176E7079e0716fEe5A38748a7D6d",
        },
        {
            fund: "LP",
            address: "0x3F34ac42d4729A292f662D87E6b86c2B70d10C81",
        },
        
    ]
}
 
export const getAddresses = (networkID) => {
    if (networkID === Networks.AVAX_FUJI) return AVAX_FUJI 
}
