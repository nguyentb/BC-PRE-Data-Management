import React, { useState, useEffect } from 'react';
import style from '../css/Element.module.css';

type PartyProps = {
    party: Party;
    l0: number;
}

const Party: React.FC<PartyProps> = ({ party, l0 }) => {

    const { id, partyClient } = party;
    const [ownPk, setOwnPk] = useState('');
    const [ownSk, setOwnSk] = useState('');

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [heartbeat, setHeartbeat] = useState('');

    const [receipientPk, setReceipientPk] = useState('');
    const [reEncryptionKey, setReEncryptionKey] = useState('');
    const [transformableSecret, setTransformableSecret] = useState('');
    const [receivedSecret, setReceivedSecret] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
        try {
            const ownPk = partyClient.getPk();
            setOwnPk(ownPk);            
            const ownSk = partyClient.getSk();
            setOwnSk(ownSk);
        } catch (e) {
            setOwnPk('Unable to get public-key of the user');
            setOwnPk('Unable to get private-key of the user');
        }
    }, [partyClient])

    useEffect(() => {
        try {
            const message = partyClient.dec(Buffer.from(receivedSecret, 'base64'))[1];
            setReceivedMessage(message?.toString('ascii') ?? '');
        } catch (e) {
            if (receivedSecret !== '')
                setReceivedMessage(`Not decodable: ${e?.message}`);
        }
    }, [receivedSecret, partyClient])

    useEffect(() => {
        try {

            const jsonMessage = `{"name":${name}, "age":${age}, "height":${height}, "weight":${weight}, "heartbeat":${heartbeat}}`;

            //const messageBuffer = new Buffer(name + age + height + weight + heartbeat);
            const messageBuffer = new Buffer(jsonMessage);
            const transportBuffer = new Uint8Array(l0)
            messageBuffer.copy(transportBuffer);
            const transformable = partyClient.enc(transportBuffer, { transformable: true });
            setTransformableSecret(transformable?.toString('base64') ?? '');
        } catch (e) {
            setTransformableSecret(`Could not compute transformable: ${e?.message}`);
        }
    }, [name, age, height, weight, heartbeat, l0, partyClient])
    
    useEffect(() => {
        try {
            if (receipientPk === '')
                return setReEncryptionKey('');
            const reKey = partyClient.reKeyGen(Buffer.from(receipientPk, 'base64'));
            setReEncryptionKey(reKey.toString('base64'));
        } catch (e) {
            setReEncryptionKey(`Could not compute re-encryption key: ${e?.message}`);
        }
    }, [receipientPk, partyClient])

    const handleName = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const name = event.target.value;
        setName(name);
    }
    const handleAge = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const age = event.target.value;
        setAge(age);
    }

    const handleHeight = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const height = event.target.value;
        setHeight(height);
    }

    const handleWeight = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const weight = event.target.value;
        setWeight(weight);
    }
    
    const handleHeartbeat = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const heartbeat = event.target.value;
        setHeartbeat(heartbeat);
    }

    const handleReceipientPk = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const pk = event.target.value;
        setReceipientPk(pk);
    }

    const handleReEncryptionKey = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const rek = event.target.value;
        setReEncryptionKey(rek);
    }

    const handleReceivedSecret = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const secret = event.target.value;
        setReceivedSecret(secret);
    }

    return (
        <div className={style.wrapper} >
            <span className={style.title}>User ID #{id}</span><br />
            <span className={style.section}>Private Key</span>
            <textarea className={style.code} disabled defaultValue={ownSk.toString('base64')} />
            <span className={style.section}>Public Key</span>
            <textarea className={style.code} disabled defaultValue={ownPk.toString('base64')} />

            <span className={style.section}>Private Information to be shared</span>

            <p>
                <label className={style.label}>Name:</label>
                <textarea id="name" placeholder="Enter your name" className={style.personaldata} onChange={handleName} value={name} maxLength={21} />
            </p>
            
            <p>
                <label className={style.label}>Age:</label>
                <textarea id="age" placeholder="Enter your age" className={style.personaldata} onChange={handleAge} value={age} maxLength={2} />
            </p>
            
            <p>
                <label className={style.label}>Height: </label>
                <textarea id="height" placeholder="Enter your height" className={style.personaldata} onChange={handleHeight} value={height} maxLength={3} />
            </p>

            <p>
                <label className={style.label}>Weight: </label>
                <textarea id="weight" placeholder="Enter your weight" className={style.personaldata} onChange={handleWeight} value={weight} maxLength={3} />
            </p>
            <p>
                <label className={style.label}>Heart-beat: </label>
                <textarea placeholder="Enter your heart-beat" id="heartbeat" className={style.personaldata} onChange={handleHeartbeat} value={heartbeat} maxLength={3} />
            </p>

            <span className={style.section}>Ciphertext to be stored at Proxy</span>
            <textarea className={style.code} disabled value={transformableSecret} />
            
            <br/>
            <span className={style.section}>(i) Transfer the ciphertext to Proxy and (i) Register/Update storage info. to Blockchain</span>
            <br/>
            <br/>
            <button>Submit</button>
            <hr />
            <br/>

            <span className={style.section}>Counterparty Public Key</span>
            <textarea className={style.code} onChange={handleReceipientPk} value={receipientPk} />
            <span className={style.section}>Re-Encryption Key</span>
            <textarea className={style.code} disabled onChange={handleReEncryptionKey} value={reEncryptionKey} />
            
            <span className={style.section}>Received Secret</span>
            <textarea className={style.code} onChange={handleReceivedSecret} value={receivedSecret} />
            <span className={style.section}>Received Message</span>
            <textarea className={style.code} disabled value={receivedMessage} />
        </div>        
    );
}

export default Party;
