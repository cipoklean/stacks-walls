const { readFileSync } = require('fs');
const tx = require('@stacks/transactions');
const net = require('@stacks/network');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  try {
    // Use networkFromName to get proper testnet config
    const network = net.networkFromName('testnet');
    console.log('Network:', network);
    
    const result = await tx.makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      network,
      nonce: 3,
      fee: 5000000,
    });
    
    console.log('Transaction created, TXID:', result.txid());
    
    const broadcastResult = await tx.broadcastTransaction(result.transaction.serialize(), network);
    console.log('Broadcast TXID:', broadcastResult);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

deploy();