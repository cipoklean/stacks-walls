const { callReadOnlyFunction, cvToHex, ClarityValue, cvToValue } = require('@stacks/transactions');

// Check what's available
console.log('callReadOnlyFunction:', typeof callReadOnlyFunction);
console.log('cvToHex:', typeof cvToHex);
console.log('ClarityValue:', ClarityValue);
console.log('cvToValue:', typeof cvToValue);

// Try constructing args manually as hex strings (what callReadOnlyFunction does internally)
const args = [
  cvToHex(ClarityValue.uint(0)),
  cvToHex(ClarityValue.list([ClarityValue.uint(5)]))
];
console.log('Args as hex:', args);

// But ClarityValue might not be exported... let's check what cvToHex expects
console.log('ClarityValue type:', typeof ClarityValue);
if (ClarityValue) {
  console.log('ClarityValue keys:', Object.keys(ClarityValue));
  console.log('ClarityValue.uint:', typeof ClarityValue.uint);
}