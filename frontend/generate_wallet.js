const crypto = require('crypto');
const { generateMnemonic, mnemonicToSeedSync } = require('@scure/bip39');
const bip32 = require('@scure/bip32');
const { publicKeyToHex } = require('@stacks/transactions');
const { c32address } = require('c32check');

// Generate fresh 24-word mnemonic
const mnemonic = generateMnemonic();
console.log('MNEMONIC=' + mnemonic);

// Derive seed
const seed = mnemonicToSeedSync(mnemonic, '');
const node = bip32.BIP32Factory({crypto}).fromSeed(seed.toBuffer());
const child = node.derivePath("m/44'/5757'/0'/0/0");
const privateKey = Buffer.from(child.privateKey).toString('hex');
const pubKey = publicKeyToHex(child.publicKey.slice(1));

// hash160
const sha256Hash = crypto.createHash('sha256').update(Buffer.from(pubKey, 'hex')).digest();
const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
const stAddr = c32address(26, ripemd160Hash.toString('hex'));
const spAddr = c32address(22, ripemd160Hash.toString('hex'));

console.log('PRIVATE_KEY=' + privateKey);
console.log('ADDRESS_ST=' + stAddr);
console.log('ADDRESS_SP=' + spAddr);
