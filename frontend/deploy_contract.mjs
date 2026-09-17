import { readFileSync } from 'fs';
import { 
  createContractPublishTransaction, 
  AnchorMode,
  BufferCV,
  intToBigInt
} from '@stacks/transactions';
import fetch from 'node-fetch';

// Your funded private key (corresponds to ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4)
const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const deployerAddress = 'ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4';

console.log('Loading contract...');
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf-8');

console.log('Creating contract publish transaction...');
console.log('Deployer:', deployerAddress);
console.log('Contract name: guestbook');

try {
  // Create contract publish transaction
  const tx = await createContractPublishTransaction({
    anchorMode: AnchorMode.Any,
    contractName: 'guestbook',
    codeBody: contractSource,
    senderPrivateKey: privateKey,
    network: 'testnet',
    fee: BigInt(200000), // 0.002 STX
    nonce: BigInt(0),
  });

  console.log('\nTransaction created!');
  console.log('Serialized transaction:', tx.serialize());

  // Broadcast transaction
  console.log('\nBroadcasting to testnet...');
  const response = await fetch('https://api.testnet.hiro.so/extend/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: Buffer.from(tx.serialize(), 'hex'),
  });

  const result = await response.json();
  console.log('Response:', JSON.stringify(result, null, 2));
  
} catch (err) {
  console.error('Error:', err.message);
  if (err.cause) console.error('Cause:', err.cause);
}
