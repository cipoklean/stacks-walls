const fs = require('fs');
const fs = require('fs');
const path = '/home/ubuntu/stacks-walls/frontend/public/index.html';
let content = fs.readFileSync(path, 'utf8');

// Find and replace the loadPosts function
const startMarker = '    async function loadPosts() {';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
  console.log('ERROR: Could not find loadPosts function');
  process.exit(1);
}

// Find the end of the function
let depth = 0;
let endIndex = -1;
for (let i = startIndex; i < content.length; i++) {
  if (content[i] === '{') depth++;
  if (content[i] === '}') {
    depth--;
    if (depth === 0 && i > startIndex) {
      endIndex = i + 1;
      break;
    }
  }
}

if (endIndex === -1) {
  console.log('ERROR: Could not find end of loadPosts function');
  process.exit(1);
}

const newLoadPosts = `    async function loadPosts() {
      const grid = document.getElementById('postsGrid');
      grid.innerHTML = '<div class="state-placeholder"><div class="spinner"></div><p>Loading posts...</p></div>';
      
      try {
        // Use stx_callContract via wallet (if connected) or direct fetch
        // For direct fetch, we need the correct API format
        // Hiro testnet API: POST to /v2/contracts/call-read/{contractAddress}/{functionName}
        // Body should be empty array [] for no-arg functions
        
        const contractAddr = CONTRACT_ADDRESS.split('.')[0];
        const contractName = CONTRACT_ADDRESS.split('.')[1];
        const callUrl = 'https://api.testnet.hiro.so/v2/contracts/call-read/' + 
          encodeURIComponent(contractAddr) + '/' + 
          encodeURIComponent(contractName) + '/get-post-count';
        
        console.log('Calling:', callUrl);
        
        const countResp = await fetch(callUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '[]'  // Empty array for functions with no args
        });
        
        if (!countResp.ok) {
          console.error('Count response not ok:', countResp.status, await countResp.text());
          throw new Error('API returned ' + countResp.status);
        }
        
        const countJson = await countResp.json();
        console.log('Count response:', countJson);
        
        // Try multiple possible response formats
        let count = 0;
        if (countJson.result !== undefined) {
          count = parseInt(countJson.result, 16);
        } else if (countJson.data !== undefined && countJson.data.result !== undefined) {
          count = parseInt(countJson.data.result, 16);
        } else if (typeof countJson === 'number') {
          count = countJson;
        }
        
        console.log('Post count:', count);
        
        if (count === 0 || isNaN(count)) {
          grid.innerHTML = '<div class="state-placeholder"><p>No posts yet. Be the first!</p></div>';
          return;
        }
        
        // Fetch posts (up to last 20)
        const limit = Math.min(count, 20);
        const start = count - limit;
        
        // Build args: get-posts(start: uint, len: uint)
        // Clarity expects tuple for first arg and list for second
        const postsUrl = 'https://api.testnet.hiro.so/v2/contracts/call-read/' + 
          encodeURIComponent(contractAddr) + '/' + 
          encodeURIComponent(contractName) + '/get-posts';
        
        // Try different arg formats
        const postsArgs = [
          { type: 'tuple', value: { 'start-index': String(start) + 'u' } },
          { type: 'list', value: [String(limit) + 'u'] }
        ];
        
        const postsResp = await fetch(postsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ args: postsArgs })
        });
        
        if (!postsResp.ok) {
          console.error('Posts response not ok:', postsResp.status, await postsResp.text());
          throw new Error('Posts API returned ' + postsResp.status);
        }
        
        const postsJson = await postsResp.json();
        console.log('Posts response:', JSON.stringify(postsJson).slice(0, 500));
        
        // Parse posts - try multiple formats
        posts = [];
        if (postsJson.result && postsJson.result.list) {
          posts = postsJson.result.list.map(item => {
            const t = item.tuple || item;
            return {
              author: t.author || t.contract_call || 'unknown',
              content: t.content || '',
              timestamp: parseInt(t.timestamp, 10) * 1000 || Date.now()
            };
          });
        } else if (postsJson.result && Array.isArray(postsJson.result)) {
          posts = postsJson.result.map(item => ({
            author: item.author,
            content: item.content,
            timestamp: parseInt(item.timestamp, 10) * 1000 || Date.now()
          }));
        }
        
        console.log('Parsed posts:', posts.length);
        
        // Render
        renderPosts();
        
      } catch (err) {
        console.error('Load failed:', err);
        grid.innerHTML = '<div class="state-placeholder"><p>Failed to load posts</p><p>' + err.message + '</p></div>';
      }
    }`;

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);
const newContent = before + newLoadPosts + after;

fs.writeFileSync(path, newContent);
console.log('Frontend loadPosts updated with better error handling');