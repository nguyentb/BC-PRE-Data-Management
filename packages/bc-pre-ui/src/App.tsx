import React, { useState, useEffect, useCallback } from 'react';
import { PRE, PREClient } from 'bc-pre-core';
import Party from './ui/Party';
import Proxy from './ui/Proxy';
import style from './css/App.module.css';

import DataManagementSC from './Ethereum-lib/DataManagement.json';
import getWeb3 from './Ethereum-lib/getWeb3';
import * as keyManagement from './Ethereum-lib/keyManagement';

const App: React.FC = () => {

    const [initialized, setInitialized] = useState(false);
    const [L0] = useState(32);
    const [L1] = useState(16);
    const [parties, setParties] = useState<Party[]>([]);
    const [proxies, setProxies] = useState<Proxy[]>([]);

    const reGenParty = useCallback(() => {
        try {
            console.log("Re-generating public/private keypair!");
            setParties([0].map((id) => {
                const partyClient = new PREClient();
                partyClient.keyGen();
                keyManagement.createCookie('pre_user_private_key', partyClient.getSk().toString('base64'), 7);
                return {
                    id,
                    partyClient
                }
            }))
            
        } catch (e) {
            console.log(`Could not generate a key-pair: ${e?.message}`);            
        }
    }, [parties]);

    // setup environment to interact with the smart contract
    const [web3, setWeb3] = useState('');
    const [accountAddr, setAccountAddr] = useState('');
    const [contractAddr, setContractAddr] = useState('');
    const [contractInstance, setContractInstance] = useState('');

    const bcSubmit = {        

    }


    useEffect(() => {
        (async () => {
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();
            
                // Use web3 to get the user's accounts.
                const accountAddr = await web3.eth.getAccounts();
            
                // Get the contract instance.
                //const networkId = await web3.eth.net.getId();
                const deployedNetwork = DataManagementSC.networks[4];
                const instance = new web3.eth.Contract(
                    DataManagementSC.abi,
                    deployedNetwork && deployedNetwork.address,
                );
            
                // Set web3, accounts, and contract to the state
                setWeb3(web3);
                setAccountAddr(accountAddr);
                setContractAddr(deployedNetwork.address);
                setContractInstance(instance);
                

                // const _dataHash = '123';
                // console.log(instance);
                // console.log(accountAddr);
                // instance.methods.uploadData(accountAddr[0], _dataHash).send({from: accountAddr[0]}, (error, result) => {
                //     if (!error){
                //         console.log(JSON.stringify(result));
                //     } else {
                //         console.log("Error in transaction");
                //         console.log(error);
                //     }
                // });

                // web3.eth.getGasPrice((e, gasPrice) => {
                //     if(!e){                      
                //       const _dataHash = '123';
                //       instance.uploadData.estimateGas(web3.eth.defaultAccount, _dataHash, (er, gas) => {
                //         if(!er){
                //           tx = {
                //             from: web3.eth.defaultAccount,
                //             gas: gas,
                //             gasPrice: gasPrice
                //           };
                //           instance.uploadData.sendTransaction(web3.eth.defaultAccount, _dataHash, (error, result) => {
                //                 if (!error){
                //                   console.log(JSON.stringify(result));
                //                 } else {
                //                   console.log("Error in transaction");
                //                   console.log(error);
                //                 }
                //               });
                //         } else {
                //           console.log(er);
                //         }
                //       });
                //     } else {
                //       console.log(e);
                //     }
                // })

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        })();
    }, [web3, accountAddr, contractAddr, contractInstance]);

    useEffect(() => {
        if (initialized === false)
            (async () => {
                try {
                    await PRE.init(L0, L1, PRE.CURVE.SECP256K1);
                    const user_sk = keyManagement.readCookie('pre_user_private_key');
                    if (!!user_sk) { // User has already been initialised. Public/private key-pair is stored using Cookies
                        console.log("User has already been initialised. Public/private key-pair is stored using Cookies: " + user_sk);
                        setParties([0].map((id) => {
                            const partyClient = new PREClient();
                            partyClient.loadKey(new Buffer(user_sk, 'base64'));
                            return {
                                id,
                                partyClient
                            }
                        }))
                    } else {
                        console.log("User initialised!" + user_sk);
                        setParties([0].map((id) => {
                            const partyClient = new PREClient();
                            partyClient.keyGen();
                            keyManagement.createCookie('pre_user_private_key', partyClient.getSk().toString('base64'), 7);
                            return {
                                id,
                                partyClient
                            }
                        }))
                    }
                    
                    setProxies([0].map((id) => {
                        return { id }
                    }))

                } catch (error) {
                    console.error('A problem occured!', error);
                };
            })();

        setInitialized(true);
    }, [initialized, L0, L1, parties]);

    return (
        <div className={style.dashboard} >
            <header className={style.header} >
                <h2>Personal Data Management based on Blockchain and Proxy Re-encryption (PRE)</h2>
                <h4>Smart Contract Address: <span className={style.textinfo}>{contractAddr}</span></h4>
                <h4>Account Address: <span className={style.textinfo}>{accountAddr}</span></h4>
                <hr />
            </header>

            <hr />
            <div className={style.userinfo}>            
                <span><button onClick={() => reGenParty()}>Re-generate keypair</button></span>
                <br />
            </div>
            <hr />

            <section className={style.parties}>
                {parties.map((party, index) => {
                    return <Party key={index} l0={L0} party={party} />
                })}
            </section>

            <section className={style.proxies}>
                {proxies.map((proxy, index) => {
                    return <Proxy key={index} proxy={proxy} />
                })}
            </section>
        </div>
    );
}

export default App;
