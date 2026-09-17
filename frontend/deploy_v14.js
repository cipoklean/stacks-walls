const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const { STACKS_TESTNET, createNetwork } = require('@stacks/network');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  try {
    const network = STACKS_TESTNET;
    
    const result = await makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      network,
      nonce: 3,
      fee: 5000000,
    });
    
    console.log('TX created:', result.txid());
    
    const txid = await broadcastTransaction(result.transaction.serialize(), network);
    console.log('Broadcast TXID:', txid);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

deploy();