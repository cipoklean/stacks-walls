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
    
    console.log('TXID:', transaction.txid());
    
    const serialized = transaction.serialize();
    console.log('Serialized length:', serialized.length);
    console.log('Serialized hex:', serialized.toString('hex').slice(0, 100) + '...');
    
    // Try with different broadcast formats
    const txid = await broadcastTransaction(serialized, 'testnet');
    console.log('Broadcast TXID:', txid);
  } catch (error) {
    console.error('Error:', error.message);
    
    // Manual broadcast via API
    try {
      const fetch = require('node-fetch');
      const serialized = transaction.serialize();
      const response = await fetch('https://api.testnet.hiro.so/v1/txs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: serialized,
      });
      
      const result = await response.json();
      console.log('Manual broadcast result:', result);
    } catch (e) {
      console.error('Manual broadcast also failed:', e.message);
    }
  }
}

deploy();