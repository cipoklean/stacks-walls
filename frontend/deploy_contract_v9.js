const { readFileSync } = require('fs');
const { TestnetNetwork, makeContractDeploy, broadcastTransaction, uintToCV, privateKeyToAddress, privateKeyToPublicKey } = require('@stacks/transactions');

const privateKey = '0d9e111df0770e0e11a5e72408456ec570f9e5dd2d9dd3ed8d017a84c1be5cbf01';
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');

async function deploy() {
  const network = new TestnetNetwork({
    fee: 5000000,
    nonce: 3,
    chainId: 0x80000001,
  });
  
  try {
    const { serializedTransaction } = await makeContractDeploy({
      contractName: 'guestbook',
      contractBody: contractSource,
      senderKey: privateKey,
      network,
    });
    
    const txid = await broadcastTransaction(serializedTransaction, network);
    console.log('TXID:', txid);
  } catch (error) {
    console.error('Deploy failed:', error.message);
  }
}

deploy();
