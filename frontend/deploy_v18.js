const { readFileSync } = require('fs');
const tx = require('@stacks/transactions');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  try {
    // Check what makeContractDeploy expects
    console.log('Testing makeContractDeploy...');
    
    const result = await tx.makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      nonce: 3,
      fee: 5000000,
    });
    
    console.log('TX created:', result.txid());
    
    const broadcastResult = await tx.broadcastTransaction(result.transaction.serialize(), 'testnet');
    console.log('Broadcast TXID:', broadcastResult);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

deploy();