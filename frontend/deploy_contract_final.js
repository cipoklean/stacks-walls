const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  try {
    const result = await makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      network: STACKS_TESTNET,
      nonce: 3,
      fee: 5000000,
    });
    
    console.log('Transaction created successfully');
    console.log('Fee:', result.transaction fee);
    
    const txid = await broadcastTransaction(result.transaction.serialize(), STACKS_TESTNET);
    console.log('Deployed! TXID:', txid);
  } catch (error) {
    console.error('Deploy failed:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

deploy();