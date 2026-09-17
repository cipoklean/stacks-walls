const { randomPrivateKey, privateKeyToAddress } = require('@stacks/transactions');
const { c32address } = require('c32check');
const crypto = require('crypto');

// Use the private key you funded
const PRIV_KEY = 'e99eedd6678ab5ab53a5759856688925089b2eb4d548ed80481e84400b160f99';

// Get the Stacks address for this key
const address = privateKeyToAddress(PRIV_KEY);
console.log('DEPLOYER_ADDRESS=' + address);
console.log('DEPLOYER_PRIVATE_KEY=' + PRIV_KEY);
