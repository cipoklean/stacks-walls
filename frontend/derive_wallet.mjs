import { generateWallet, generateNewAccount, getStxAddress } from '@stacks/wallet-sdk';

const mnemonic = 'wash zone great replace kingdom letter anger response actual visit focus letter';
console.log('Mnemonic:', mnemonic);

// Generate wallet
const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
console.log('Wallet generated');

// Try different account indices
for (let i = 0; i < 5; i++) {
  const account = wallet.accounts[i];
  if (account) {
    const privateKey = account.stxPrivateKey;
    // Use default network (testnet by default in stacks.js v6+)
    const address = getStxAddress({ account });
    console.log(`Account ${i}:`, { privateKey, address });
  }
}
