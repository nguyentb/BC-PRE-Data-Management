import React, { useState, useEffect } from 'react';
import style from '../css/Element.module.css';
import { PREClient } from 'bc-pre-core';

type UserProps = {
    user: PREClient;
    l0: number;
}

const User: React.FC<UserProps> = ({ user, l0 }) => {
    
    const [ownPk, setOwnPk] = useState(user.getPk());
    const [ownSk, setOwnSk] = useState(user.getSk());
    const [ownMessage, setOwnMessage] = useState('');
    const [receipientPk, setReceipientPk] = useState('');
    const [reEncryptionKey, setReEncryptionKey] = useState('');
    const [transformableSecret, setTransformableSecret] = useState('');
    const [receivedSecret, setReceivedSecret] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
        try {
            const message = user.dec(Buffer.from(receivedSecret, 'base64'))[1];
            setReceivedMessage(message?.toString('ascii') ?? '');
        } catch (e) {
            if (receivedSecret !== '')
                setReceivedMessage(`Not decodable: ${e?.message}`);
        }
    }, [receivedSecret, user])

    useEffect(() => {
        try {
            const messageBuffer = new Buffer(ownMessage);
            const transportBuffer = new Uint8Array(l0)
            messageBuffer.copy(transportBuffer);
            const transformable = user.enc(transportBuffer, { transformable: true });
            setTransformableSecret(transformable?.toString('base64') ?? '');
        } catch (e) {
            setTransformableSecret(`Could not compute transformable: ${e?.message}`);
        }
    }, [ownMessage, l0, user])
    
    useEffect(() => {
        try {
            if (receipientPk === '')
                return setReEncryptionKey('');
            const reKey = user.reKeyGen(Buffer.from(receipientPk, 'base64'));
            setReEncryptionKey(reKey.toString('base64'));
        } catch (e) {
            setReEncryptionKey(`Could not compute re-encryption key: ${e?.message}`);
        }
    }, [receipientPk, user])

    const handleOwnMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const message = event.target.value;
        setOwnMessage(message);
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
            <span className={style.section}>Private Key</span>
            <textarea className={style.code} disabled defaultValue={ownSk.toString('base64')} />
            <span className={style.section}>Public Key</span>
            <textarea className={style.code} disabled defaultValue={ownPk.toString('base64')} />
            <span className={style.section}>Private Information to be shared</span>
            <textarea className={style.code} onChange={handleOwnMessage} value={ownMessage} maxLength={32} />
            <span className={style.section}>Counterparty Public Key</span>
            <textarea className={style.code} onChange={handleReceipientPk} value={receipientPk} />
            <span className={style.section}>Re-Encryption Key</span>
            <textarea className={style.code} disabled onChange={handleReEncryptionKey} value={reEncryptionKey} />
            <span className={style.section}>Transformable Secret</span>
            <textarea className={style.code} disabled value={transformableSecret} />
            <span className={style.section}>Received Secret</span>
            <textarea className={style.code} onChange={handleReceivedSecret} value={receivedSecret} />
            <span className={style.section}>Received Message</span>
            <textarea className={style.code} disabled value={receivedMessage} />
        </div>
    );
}

export default User;
