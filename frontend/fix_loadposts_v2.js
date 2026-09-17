const fs = require('fs');
const path = '/home/ubuntu/stacks-walls/frontend/public/index.html';
let content = fs.readFileSync(path, 'utf8');

// Find and replace the loadPosts function
const startMarker = '    async function loadPosts() {';
const endMarker = '      } catch (err) {\n        console.error(\'Load failed:\', err);\n        grid.innerHTML = \'<div class="state-placeholder"><p>Failed to load posts</p></div>\';\n      }\n    }';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
  console.log('ERROR: Could not find loadPosts function');
  process.exit(1);
}

// Find the end of the function (the catch block + closing brace)
let searchFrom = startIndex;
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
        // Fetch post count
        const countUrl = 'https://api.testnet.hiro.so/v2/contracts/call-read/' + CONTRACT_ADDRESS + '/get-post-count';
        const countResp = await fetch(countUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '[]' });
        const countJson = await countResp.json();
        const count = parseInt(countJson.result, 16);
        
        if (count === 0) {
          grid.innerHTML = '<div class="state-placeholder"><p>No posts yet. Be the first!</p></div>';
          return;
        }
        
        // Fetch posts (up to last 20)
        const limit = Math.min(count, 20);
        const start = count - limit;
        
        // Build args for get-posts(start, len) - Clarity tuple/list
        const args = JSON.stringify([
          { type: 'tuple', value: { 'start-index': String(start) + 'u' } },
          { type: 'list', value: [String(limit) + 'u'] }
        ]);
        
        const postsUrl = 'https://api.testnet.hiro.so/v2/contracts/call-read/' + CONTRACT_ADDRESS + '/get-posts';
        const postsResp = await fetch(postsUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ args }) });
        const postsJson = await postsResp.json();
        
        // Parse posts from Clarity list
        posts = [];
        if (postsJson.result && postsJson.result.list) {
          posts = postsJson.result.list.map(item => {
            const t = item.tuple || item;
            return {
              author: t.author,
              content: t.content,
              timestamp: parseInt(t.timestamp, 10)
            };
          });
        }
        
        // Render
        renderPosts();
        
      } catch (err) {
        console.error('Load failed:', err);
        grid.innerHTML = '<div class="state-placeholder"><p>Failed to load posts</p></div>';
      }
    }`;

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);
const newContent = before + newLoadPosts + after;

fs.writeFileSync(path, newContent);
console.log('Frontend loadPosts fixed successfully');