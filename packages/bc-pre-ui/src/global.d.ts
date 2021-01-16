import { PREClient } from "bc-pre-core";

declare module 'crypto-browserify';

declare module 'bc-pre-core' {

    interface PRE {
    }

    declare var PRE: {
        prototype: PRE;
        new(): PRE;
        CURVE: CurveList;
        init: (l0: number, l1: number, curve: number) => void
    };

    interface PREClient {
        keyGen: () => void;
        dec: (buffer: Uint8Array) => [any, Buffer];
    }

    declare var PREClient: {
        prototype: PREClient;
        new(): PREClient;
    };

    declare var PREProxy: {
        reEnc: (buffer: Uint8Array, reKey: Uint8Array, pk: Uint8Array) => [any, Buffer]
        reEnc2: (buffer: Uint8Array, reKey: Uint8Array) => Buffer
    };

    type CurveList = {
        SECP224K1: number;
        SECP256K1: number;
        SECP384R1: number;
        NIST_P192: number;
        NIST_P224: number;
        NIST_P256: number;
    }

}

type Party = {
    id: number;
    partyClient: PREClient;
}

type Proxy = {
    id: number;
}

type User = {
    user: PREClient;
}