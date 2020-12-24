import React, { useState, useEffect } from 'react';
import { PRE, PREClient } from 'ideafast-pre';
import Party from './Party';
import Proxy from './Proxy';
import style from './App.module.css';

const App: React.FC = () => {

    const [initialized, setInitialized] = useState(false);
    const [L0] = useState(32);
    const [L1] = useState(16);
    const [parties, setParties] = useState<Party[]>([]);
    const [proxies, setProxies] = useState<Proxy[]>([]);

    useEffect(() => {
        if (initialized === false)
            (async () => {
                try {
                    await PRE.init(L0, L1, PRE.CURVE.SECP256K1);
                    setParties([0, 1, 3].map((id) => {
                        const partyClient = new PREClient();
                        partyClient.keyGen();
                        return {
                            id,
                            partyClient
                        }
                    }))
                    setProxies([0].map((id) => {
                        return { id }
                    }))
                } catch (error) {
                    console.error('A problem occured', error);
                };
            })();

        setInitialized(true);
    }, [initialized, L0, L1]);

    const addParty = () => {
        const partyClient = new PREClient();
        partyClient.keyGen();
        setParties(parties.concat({
            id: parties.length + 1,
            partyClient
        }))
    }

    const addProxy = () => {
        setProxies(proxies.concat({
            id: proxies.length + 1
        }))
    }

    const handlePartyClose = (id: number) => {
        setParties(parties.filter(party => party.id !== id))
    }

    const handleProxyClose = (id: number) => {
        setProxies(proxies.filter(proxy => proxy.id !== id))
    }

    return (
        <div className={style.dashboard} >
            <header className={style.header} >
                Proxy Re - Encryption POC&nbsp;&nbsp;&nbsp;<button onClick={() => addParty()}>Add party</button>  <button onClick={() => addProxy()}>Add proxy</button>
            </header>
            <section className={style.parties}>
                {parties.map((party, index) => {
                    return <Party key={index} l0={L0} party={party} onClose={handlePartyClose} />
                })}
            </section>
            <section className={style.proxies}>
                {proxies.map((proxy, index) => {
                    return <Proxy key={index} proxy={proxy} onClose={handleProxyClose} />
                })}
            </section>
        </div>
    );
}

export default App;
