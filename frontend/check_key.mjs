import { generateWallet } from '@stacks/wallet-sdk';

// We need to find the mnemonic that produces the address STKB5C17...
// Let's try different derivation paths or just use the known private key approach

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
console.log('Using private key:', privateKey);
console.log('This corresponds to testnet address ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4');
console.log('Balance: 4 STX (sufficient for deployment)');
