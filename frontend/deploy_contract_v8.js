const { readFileSync } = require('fs');
const tx = require('@stacks/transactions');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  const network = new tx.TestnetNetwork();
  const contractName = 'guestbook';
  
  try {
    const { serializedTransaction } = await tx.makeContractDeploy({
      contractName,
      contractBody: contractSource,
      senderKey: privateKey,
      network,
      nonce: 3,
      fee: tx.uintToCV(5000000),
    });
    
    const broadcastResult = await tx.broadcastTransaction(serializedTransaction, network);
    console.log('TXID:', broadcastResult);
  } catch (error) {
    console.error('Deploy failed:', error.message);
  }
}

deploy();
