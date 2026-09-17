const { privateKeyToAccount, privateKeyToAddress } = require('@stacks/transactions');
const { randomPrivateKey } = require('@stacks/transactions');
const crypto = require('crypto');

// Generate a new random private key for deployment
const newKey = randomPrivateKey();
console.log('PRIVATE_KEY=' + newKey.slice(2));

// Get the SP address (contract calls)
const spAddress = privateKeyToAddress(newKey);
console.log('ADDRESS_SP=' + spAddress);

// Derive ST address using BIP32-style approach for testnet
// For now, let's just show the SP address which is what the frontend needs
console.log('\nUpdate your frontend .env.local with this PRIVATE_KEY');
console.log('Then fund SP' + spAddress.slice(2) + ' or use this for deployment');
