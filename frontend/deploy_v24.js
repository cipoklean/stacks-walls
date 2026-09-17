const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');

async function deploy() {
  try {
    const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
    const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');
    
    console.log('Creating deployment...');
    
    // IMPORTANT: makeContractDeploy returns a Promise in v6
    const transaction = await makeContractDeploy({
      contractName: 'guestbook',
      codeBody: contractSource,
      senderKey: privateKey,
      network: 'testnet',
      nonce: BigInt(3),
      fee: BigInt(5000000),
    });
    
    console.log('TXID:', transaction.txid());
    
    const txid = await broadcastTransaction(transaction.serialize(), 'testnet');
    console.log('Broadcast TXID:', txid);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

deploy();