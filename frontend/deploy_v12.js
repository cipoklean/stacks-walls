const { readFileSync } = require('fs');
const tx = require('@stacks/transactions');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  try {
    // Build contract deploy transaction
    const contractDeploy = await tx.buildContractDeploy({
      contractName: 'guestbook',
      codeBody: contractSource,
      senderKey: privateKey,
      nonce: 3,
      fee: 5000000,
    });
    
    console.log('Built contract deploy');
    console.log('TX ID:', contractDeploy.txid());
    
    // Broadcast
    const broadcastResult = await tx.broadcastTransaction(contractDeploy.serialize(), 'testnet');
    console.log('Broadcast TXID:', broadcastResult);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

deploy();