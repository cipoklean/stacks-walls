const { readFileSync } = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');

async function deploy() {
  try {
    const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
    const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');
    
    console.log('Creating deployment...');
    
    const result = await makeContractDeploy({
      contractName: 'guestbook',
      codeBody: contractSource,
      senderKey: privateKey,
      network: 'testnet',
      nonce: BigInt(3),
      fee: BigInt(5000000),
    });
    
    console.log('Result keys:', Object.keys(result));
    console.log('TXID via txid():', result.txid());
    
    // The txid() method works, so let's find the serialized form
    const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(result));
    console.log('Prototype methods:', proto);
    
    // Try the internal serializeBytes method
    if (result.serializeBytes) {
      const serialized = result.serializeBytes();
      console.log('Serialized length:', serialized.length);
      const txid = await broadcastTransaction(serialized, 'testnet');
      console.log('Broadcast TXID:', txid);
    } else {
      // Try manual serialization using the public keys
      const pubKey = result.auth.publicKey;
      console.log('Public key:', pubKey);
      
      // Use the raw transaction hex
      const txHex = Buffer.from(result.transaction.hex).toString('hex');
      console.log('Raw hex:', txHex);
      
      const txid = await broadcastTransaction(txHex, 'testnet');
      console.log('Broadcast TXID:', txid);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

deploy();