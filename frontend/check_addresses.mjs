import { privateKeyToAddress } from '@stacks/transactions';

// Your mnemonic-derived private key
const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';

// Try different network prefixes
console.log('Testing address formats:');
try {
  // SP = mainnet, ST = testnet
  const spAddr = privateKeyToAddress(privateKey);
  console.log('Mainnet (SP):', spAddr);
} catch(e) {
  console.log('SP Error:', e.message);
}

// Let's also check what the testnet address should be
// Based on the pattern, ST12JJR... should correspond to the same keys as SP12JJR...
console.log('\nYour funded testnet address: ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4');
console.log('Derived mainnet address:     SP12JJRGZECY58KTESA0KFPZR68GQRK6T0F0HFWK2');
console.log('\nNote: They share the same base but different prefixes for testnet vs mainnet.');
console.log('For testnet deployment, you need the ST prefix address.');
