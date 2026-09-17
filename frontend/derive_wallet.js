const { privateKeyToAddress } = require('@stacks/transactions');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
console.log('Private Key:', privateKey);
console.log('SP Address (testnet):', privateKeyToAddress(privateKey));
