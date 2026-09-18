const { ClarityValue, cvToValue, callReadOnlyFunction } = require('@stacks/transactions');

async function test() {
  console.log('ClarityValue methods:', Object.keys(ClarityValue));
  
  try {
    console.log('Testing get-post-count...');
    const countResult = await callReadOnlyFunction({
      contractAddress: 'ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4',
      contractName: 'guestbook',
      functionName: 'get-post-count',
      functionArgs: [],
      network: 'testnet',
      senderAddress: 'ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4'
    });
    console.log('Count raw:', countResult);
    console.log('Count parsed:', cvToValue(countResult));
    
    console.log('\nTesting get-posts...');
    const postsResult = await callReadOnlyFunction({
      contractAddress: 'ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4',
      contractName: 'guestbook',
      functionName: 'get-posts',
      functionArgs: [ClarityValue.uint(0), ClarityValue.list([ClarityValue.uint(5)])],
      network: 'testnet',
      senderAddress: 'ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4'
    });
    console.log('Posts raw:', JSON.stringify(postsResult, null, 2));
    console.log('Posts parsed:', cvToValue(postsResult));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();