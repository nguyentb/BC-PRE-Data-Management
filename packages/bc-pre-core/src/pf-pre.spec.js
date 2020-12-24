import { PRE } from '../dist/index';
// import { PRE } from './pf-pre';

describe('PRE', () => {
    test('Can initialize', async () => {
        let exception = undefined;
        let result = undefined;
        const L0 = 32;
        const L1 = 16;
        try {
            result = await PRE.init(L0, L1, PRE.CURVE.SECP256K1);
        } catch (e) {
            exception = e;
        } finally {
            expect(exception).toBe(undefined);
        }
    })
})