const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  try {
    // Use the correct network object for testnet
    const network = {
      network: 'testnet',
      fee: 5000000,
      nonce: 3,
      chainId: 0x80000001,
    };
    
    const result = await makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      network,
    });
    
    console.log('TX created:', result.txid());
    
    const txid = await broadcastTransaction(result.transaction.serialize(), network);
    console.log('Broadcast TXID:', txid);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

deploy();