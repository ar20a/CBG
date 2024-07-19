import './App.css';
import './utils.js';
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ethers } from 'ethers'
import { DeFiWeb3Connector } from "deficonnect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { providers } from "ethers"


import CBG from './artifacts/contracts/CryptobackGorillas.sol/CryptobackGorillas.json';


const CBGAddress = '0x4075d14576304A63c617028b3c2949Ff6D0fDaEB'





function App() {
    const [address, setaddress] = useState('Not Connected')
    const [connecterror, setconnecterror] = useState('')
    const [mintsuccess, setmintsuccess] = useState('')
    const [minterror, setminterror] = useState('')
    const [connection, setconnection] = useState(0)
    const [nftremaining, setnftremaining] = useState('??')
    const [optionstate, setoptionstate] = useState(0)
    const [numofMints, setnumofMints] = useState(1)


    async function GetBalances_CBG_Cro() {
    try{

            const providerwc = new WalletConnectProvider({
              rpc: {
                25:
                  "https://evm-cronos.crypto.org/",
              },
              chainId: 25,
            });
            await providerwc.enable();
            const provider = new ethers.providers.Web3Provider(providerwc);
            const signer = provider.getSigner()
            const account = await provider.getSigner().getAddress()
            console.log(account);
            const chainId = await provider.getNetwork();
            console.log(chainId.chainId);
            if(chainId.chainId!='25'){
                setconnecterror('Cryptoback Gorillas are not supported on this network. Please connect to Cronos Mainnet');
                return;
            }

            const CBGNFT = new ethers.Contract(CBGAddress, CBG.abi, signer);
            const remaining =  ethers.utils.formatEther( await CBGNFT.CBGRemaining() )*1000000000000000000;
            setnftremaining(remaining);
            setaddress(account);
            setconnecterror('');
            setconnection(1);


            try {

                  return
              }
              catch(e) {
                  setconnecterror("NFT Minting Contract Not Approved - Please Approve to Mint");
                  console.log(e);
                  return
              }


            //get_NFT_count_svg();

    }
    catch (e) {
        setconnecterror(e);
    }
  }

    async function GetBalances_CBG() {
    try{
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const chainId = await provider.getNetwork();
            console.log(chainId.chainId);
            if(chainId.chainId!='25'){
                setconnecterror('Cryptoback Gorillas is not supported on this network. Please connect to Cronos Mainnet');
                return;
            }
            const signer = provider.getSigner()
            const CBGNFT = new ethers.Contract(CBGAddress, CBG.abi, signer);
            const remaining =  ethers.utils.formatEther( await CBGNFT.CBGRemaining() )*1000000000000000000;
            console.log(remaining);
            console.log(numofMints)
            setnftremaining(remaining);
            setaddress(account);
            setconnecterror('');
            setconnection(0);



            try {

                      return
                  }
                  catch(e) {
                      setconnecterror("NFT Minting Contract Not Approved - Please Approve to Mint");
                      console.log(e);
                      return
                  }



        }
    }
    catch (e) {
        setconnecterror("Connect Wallet Failed");
    }
  }



    async function mint_NFT_Cro() {
        const providerwc = new WalletConnectProvider({
              rpc: {
                25:
                  "https://evm-cronos.crypto.org/",
              },
              chainId: 25,
            });
        await providerwc.enable();
        const provider = new ethers.providers.Web3Provider(providerwc);
        const signer = provider.getSigner()
        const account = await provider.getSigner().getAddress()
        const CBGNFT = new ethers.Contract(CBGAddress, CBG.abi, signer);

         try{
              const options = {value: ethers.utils.parseEther("500")};
              await CBGNFT.publicSalesMint(numofMints, options);
              setmintsuccess("CBG Successfully Minted...")
          }
          catch (e){
              console.log(e);
              try{
                  if (e.data.message.toString().includes("insufficient balance")) {
                      setconnecterror("CBG Mint Failed, Not enough CRO balance in connected wallet");
                  } else {
                      setconnecterror("CBG Mint Failed, Please ensure CRO Balance exceeds the amount required to Mint (500 CRO Per CBG)");
                  }
              }
              catch{
                  setconnecterror("CBG Mint Failed");
              }
          }
   }



    async function mint_NFT() {
       if (connection == '1'){
            mint_NFT_Cro();
            return
        }
        if (typeof window.ethereum !== 'undefined') {
          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
          const CBGNFT = new ethers.Contract(CBGAddress, CBG.abi, signer);

          try{
              const options = {value: ethers.utils.parseEther("500")};
              await CBGNFT.publicSalesMint(numofMints, options);
              setmintsuccess("CBG Successfully Minted...")
          }
          catch (e){
              console.log(e);
              try{
                  if (e.data.message.toString().includes("insufficient balance")) {
                      setconnecterror("CBG Mint Failed, Not enough CRO balance in connected wallet");
                  } else {
                      setconnecterror("CBG Mint Failed, Please ensure CRO Balance exceeds the amount required to Mint (500 CRO Per CBG)");
                  }
              }
              catch{
                  setconnecterror("CBG Mint Failed");
              }
          }
       }
   }




  return (
    <div className="App" >
        <header className="header">
            <div className="col">
                <div className="content">
                    <p><a href="https://cryptobackgorillas.com"><img src="https://cryptobackgorillas.com/wp-content/uploads/2022/04/CryptobackGorillas-Logo_Wordmark1.png" alt=""  height="107" /></a></p>
					<p>Cryptoback Gorillas - An enriched collection of 10,000 NFTs on the Cronos Chain. Join the members-only collective with this exclusive and limited NFT project. Mint your CBG today. Please see <a href="https://cryptobackgorillas.com">website</a> for more information. <br/><br/> As always do your own research.</p>
					<br/>
					<p><img src="https://cryptobackgorillas.com/wp-content/uploads/2022/04/CBG-MIntPage3.gif" alt="" width="600" height="" /></p>
					<br/>
                    <p>{nftremaining} Gorillas Remaining</p>
                    <br/>
                </div>
                    <div id="contact-form">
                        <div>
                           <button onClick={GetBalances_CBG}>Connect Metamask </button>  &nbsp;
                            <button onClick={GetBalances_CBG_Cro}>Connect Defi Wallet </button>
                            <br/>
                            <br/>
                            <select name="version" id="version" onChange={(val) => setoptionstate(val.target.value)}>
                                <option value="1" >Cryptoback Gorilla (500 CRO)</option>
                            </select>
                        </div>
                        <p id="error">{connecterror}</p>
                        <p id="success">{mintsuccess}</p>
						<br/>
                        <form >
                            <div>
                                <label htmlFor="address">
                                    <span className="required">Address: *</span><br/>
                                    <input value={address}
                                            tabIndex="1" />
                                </label>
                            </div><br/>
                            <div>
                                <label htmlFor="amount">
                                    <span className="required">Number of Mints: *</span><br/>
                                    <input value={numofMints} onChange={e => setnumofMints(e.target.value)} placeholder="Amount" />
                                </label>
                            </div>
                            <div>

                            </div>
                        </form>
						<br/>
                        <button onClick={mint_NFT}>Mint a Cryptoback</button>
						<br/>


                    </div>





            </div>


        </header>






    </div>



			





  );
}

export default App;