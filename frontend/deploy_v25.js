const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');

async function deploy() {
  try {
    const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
    const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');
    
    console.log('Creating deployment...');
    
    const transaction = await makeContractDeploy({
      contractName: 'guestbook',
      codeBody: contractSource,
      senderKey: privateKey,
      network: 'testnet',
      nonce: BigInt(3),
      fee: BigInt(5000000),
    });
    
    console.log('Transaction created');
    console.log('TXID:', transaction.txid());
    
    // Check what methods are available
    console.log('Transaction methods:', Object.keys(transaction));
    console.log('Has serialize:', typeof transaction.serialize);
    console.log('Has serializeBytes:', typeof transaction.serializeBytes);
    
    // Try to serialize
    const serialized = transaction.serializeBytes();
    console.log('Serialized bytes length:', serialized.length);
    
    const txid = await broadcastTransaction(serialized, 'testnet');
    console.log('Broadcast TXID:', txid);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

deploy();