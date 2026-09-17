const { readFileSync } = require('fs');

// Read the contract
const contractSource = readFileSync('/home/ubuntu/stacks-walls/contracts/contracts/guestbook.clar', 'utf8');
const contractBytes = Buffer.from(contractSource);
const contractLength = contractBytes.length.toString(16).padStart(6, '0');

console.log('Contract length:', contractLength, '(' + contractBytes.length + ' bytes)');
console.log('First 100 chars of contract:');
console.log(contractSource.slice(0, 100));