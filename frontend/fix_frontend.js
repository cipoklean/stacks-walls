const fs = require('fs');
const path = '/home/ubuntu/stacks-walls/frontend/public/index.html';
let content = fs.readFileSync(path, 'utf8');

// Fix loadPosts: use POST instead of GET, correct URL format
const oldLoadPosts = `    async function loadPosts() {
      const grid = document.getElementById('postsGrid');
      grid.innerHTML = '<div class="state-placeholder"><div class="spinner"></div><p>Loading posts...</p></div>';

      try {
        // Fetch post count
        const countResponse = await fetch(
          \`https://api.testnet.hiro.so/v2/contracts/call-read/\${CONTRACT_ADDRESS}?function-name=get-post-count\`
        );
        const countData = await countResponse.json();
        const count = parseInt(countData.result, 16);

        if (count === 0) {
          grid.innerHTML = '<div class="state-placeholder"><p>No posts yet. Be the first!</p></div>';
          return;
        }

        // Fetch posts (up to last 20)
        const limit = Math.min(count, 20);
        const start = count - limit;

        const postsResponse = await fetch(
          \`https://api.testnet.hiro.so/v2/contracts/call-read/\${CONTRACT_ADDRESS}?function-name=get-posts&arg0=\${start}&arg1=\${limit}\`
        );
        const postsData = await postsResponse.json();

        // Parse posts
        const results = postsData.result;
        posts = results.map(item => {
          const author = item.author;
          const content = item.content;
          const timestamp = parseInt(item.timestamp, 10) / 1000;
          return { author, content, timestamp };
        });

        // Render
        renderPosts();

      } catch (err) {
        console.error('Load failed:', err);
        grid.innerHTML = '<div class="state-placeholder"><p>Failed to load posts</p></div>';
      }
    }`;

const newLoadPosts = `    async function loadPosts() {
      const grid = document.getElementById('postsGrid');
      grid.innerHTML = '<div class="state-placeholder"><div class="spinner"></div><p>Loading posts...</p></div>';

      try {
        // Fetch post count
        const countUrl = 'https://api.testnet.hiro.so/v2/contracts/call-read/' + CONTRACT_ADDRESS + '/get-post-count';
        const countResp = await fetch(countUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        const countJson = await countResp.json();
        const count = parseInt(countJson.result, 16);

        if (count === 0) {
          grid.innerHTML = '<div class="state-placeholder"><p>No posts yet. Be the first!</p></div>';
          return;
        }

        // Fetch posts (up to last 20)
        const limit = Math.min(count, 20);
        const start = count - limit;

        const postsUrl = 'https://api.testnet.hiro.so/v2/contracts/call-read/' + CONTRACT_ADDRESS + '/get-posts';
        const postsArg = 'tuple (make-triple ' + start + 'u) (list ' + limit + 'u)';
        const postsResp = await fetch(postsUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{\"principle\": \"ST12JJRGZECY58KTESA0KFPZR68GQRK6T0CDNK3Z4\", \"arg_0\": ' + postsArg + ' }' });
        const postsJson = await postsResp.json();

        // Parse posts from Clarity list
        posts = [];
        if (postsJson.result && postsJson.result.list) {
          posts = postsJson.result.list.map(item => {
            return {
              author: item.tuple.author,
              content: item.tuple.content,
              timestamp: parseInt(item.tuple.timestamp, 10)
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

content = content.replace(oldLoadPosts, newLoadPosts);
fs.writeFileSync(path, content);
console.log('Frontend updated successfully');