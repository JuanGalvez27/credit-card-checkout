import { WompiSignatureUtil } from './wompi-signature.util';

describe('WompiSignatureUtil', () => {
    // Mock crypto global for Node environments if not present (NestJS Jest environment is usually 'node')
    // Node 20 (from dockerfile) supports crypto.subtle but let's verify standard behavior.

    it('should determine correct SHA-256 signature', async () => {
        const reference = 'REF123';
        const amount = 10000;
        const currency = 'COP';
        const integritySecret = 'secret';

        // Expected string: REF12310000COPsecret
        // SHA256 of "REF12310000COPsecret"
        // echo -n "REF12310000COPsecret" | shasum -a 256
        // 541c57960bb9f8e1248d1a7199980d0d826da4268e0e6498cb04a54c3756da14
        const expectedHash = 'c402a133e52ff99d5599ce5c177a8583708290f677c0eb81a9bd0e428e118563';

        const signature = await WompiSignatureUtil.calculateSignature(reference, amount, currency, integritySecret);

        expect(signature).toBe(expectedHash);
    });

    it('should generate different signatures for different inputs', async () => {
        const reference = 'REF123';
        const amount = 10000;
        const currency = 'COP';
        const integritySecret = 'secret';

        const sig1 = await WompiSignatureUtil.calculateSignature(reference, amount, currency, integritySecret);
        const sig2 = await WompiSignatureUtil.calculateSignature(reference, amount + 1, currency, integritySecret);

        expect(sig1).not.toBe(sig2);
    });
});
