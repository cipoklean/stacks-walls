const { randomPrivateKey, privateKeyToAddress } = require('@stacks/transactions');
const crypto = require('crypto');

// Generate random private key
const privKey = randomPrivateKey();
console.log('PRIVATE_KEY=' + privKey.slice(2)); // Remove 0x prefix

// Get SP address (will work for contract calls)
const spAddress = privateKeyToAddress(privKey);
console.log('ADDRESS_SP=' + spAddress);

// Generate ST address (testnet format) - use c32check with version 26
try {
  const { c32address } = require('c32check');
  const hash160 = crypto.randomBytes(20).toString('hex');
  const stAddress = c32address(26, hash160);
  console.log('ADDRESS_ST=' + stAddress);
} catch (e) {
  console.log('ST address generation failed: ' + e.message);
}

console.log('\nIMPORTANT: Fund either address at https://explorer.hiro.so/sandbox/faucet?chain=testnet');
