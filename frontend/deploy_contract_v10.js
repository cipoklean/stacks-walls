const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  const network = new StacksTestnet();
  
  try {
    const result = await makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      network,
      nonce: 3,
      fee: 5000000,
    });
    
    console.log('TX serialized length:', result.transaction.serializedLength);
    
    const txid = await broadcastTransaction(result.transaction.serialize(), network);
    console.log('TXID:', txid);
  } catch (error) {
    console.error('Deploy failed:', error.message);
    console.error(error.stack);
  }
}

deploy();
