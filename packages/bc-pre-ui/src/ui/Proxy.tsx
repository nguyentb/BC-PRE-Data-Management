import React, { useState, useEffect } from 'react';
import { PREProxy } from 'bc-pre-core';
import style from '../css/Element.module.css';

type ProxyProps = {
    proxy: Proxy;
}

const Proxy: React.FC<ProxyProps> = ({ proxy }) => {

    const { id } = proxy;
    const [reEncryptionKey, setReEncryptionKey] = useState('');
    const [transformableSecret, setTransformableSecret] = useState('');
    const [transformedSecret, setTransformedSecret] = useState('');

    useEffect(() => {
        if (transformableSecret === '' || reEncryptionKey === '') {
            setTransformedSecret('');
            return;
        }
        try {
            const secret = Buffer.from(transformableSecret, 'base64');
            const reKey = Buffer.from(reEncryptionKey, 'base64');
            setTransformedSecret(PREProxy.reEnc2(secret, reKey)?.toString('base64') ?? '');
        } catch (e) {
            setTransformedSecret(`Could not compute transformed secret: ${e?.message}`);
        }
    }, [transformableSecret, reEncryptionKey])

    const handleReEncryptionKey = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const rek = event.target.value;
        setReEncryptionKey(rek);
    }

    const handleTransformableSecret = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const secret = event.target.value;
        setTransformableSecret(secret);
    }

    return (
        <div className={style.wrapper} >
            <span className={style.title}>Proxy ID #{id};</span><br />
            <span className={style.section}>Sender Re-Encryption Key</span>
            <textarea className={style.code} onChange={handleReEncryptionKey} value={reEncryptionKey} />
            <span className={style.section}>Transformable Secret</span>
            <textarea className={style.code} onChange={handleTransformableSecret} value={transformableSecret} />
            <span className={style.section}>Transformed Secret for Receiver</span>
            <textarea className={style.code} disabled value={transformedSecret} />
        </div>
    );
}

export default Proxy;
