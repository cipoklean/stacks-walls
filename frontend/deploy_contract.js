const { readFileSync } = require('fs');
const tx = require('@stacks/transactions');

// Your funded private key (corresponds to ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4)
const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const deployerAddress = 'ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4';

console.log('Loading contract...');
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf-8');

console.log('Creating contract publish transaction...');
console.log('Deployer:', deployerAddress);
console.log('Contract name: guestbook');

async function deploy() {
  try {
    // Create contract publish transaction with correct nonce (account already has nonce 1)
    const transaction = await tx.makeContractDeploy({
      contractName: 'guestbook',
      codeBody: contractSource,
      senderKey: privateKey,
      network: 'testnet',
      fee: BigInt(200000), // 0.002 STX
      nonce: BigInt(1), // Account nonce is 1, not 0
    });

    console.log('\nTransaction created!');
    console.log('Tx ID:', transaction.txid());

    // Broadcast using the built-in function
    console.log('\nBroadcasting to testnet...');
    const result = await tx.broadcastTransaction({ transaction });
    console.log('Broadcast result:', JSON.stringify(result, null, 2));
    
  } catch (err) {
    console.error('Error:', err.message);
    if (err.stack) console.error('Stack:', err.stack);
  }
}

deploy();
