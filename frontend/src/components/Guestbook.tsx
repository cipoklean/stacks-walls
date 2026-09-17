'use client';
import { useState, useEffect, useCallback } from 'react';
import { stringAsciiCV } from '@stacks/transactions';
import { guestbook_postMessage, guestbook_getPostByAuthor, guestbook_getPostCount } from '../generated/contracts';
import { addressAtom, isMountedAtom } from '../store/wallet';
import { useAtomValue } from 'jotai';
import { connect } from '@stacks/connect';

type Post = {
  author: string;
  content: string;
  timestamp: number;
};

export default function Guestbook() {
  const isMounted = useAtomValue(isMountedAtom);
  const address = useAtomValue(addressAtom);
  const [posts, setPosts] = useState<Post[]>([]);
  const [count, setCount] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmit, setLastSubmit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const shortenAddr = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  const loadPosts = useCallback(async () => {
    if (!address) return;
    try {
      const result = await guestbook_getPostByAuthor([stringAsciiCV(address)]);
      if (result) {
        setPosts(prev => {
          const exists = prev.some(p => p.author === address);
          if (exists) return prev;
          return [{
            author: address,
            content: (result as any).content || '',
            timestamp: Date.now()
          }, ...prev];
        });
      }
      
      const countResult = await guestbook_getPostCount();
      if (countResult) setCount(Number(countResult));
    } catch {}
  }, [address]);

  useEffect(() => {
    if (!isMounted) return;
    loadPosts().finally(() => setLoaded(true));
  }, [isMounted, loadPosts]);

  useEffect(() => {
    if (!isMounted) return;
    const poll = setInterval(async () => {
      try {
        const countResult = await guestbook_getPostCount();
        if (countResult) setCount(Number(countResult));
      } catch {}
    }, 8000);
    return () => clearInterval(poll);
  }, [isMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !address || submitting) return;

    setSubmitting(true);
    setError(null);
    setLastSubmit(null);

    try {
      const result = await guestbook_postMessage([
        stringAsciiCV(message.slice(0, 200))
      ]);
      
      if (result?.txid) {
        setLastSubmit(result.txid);
        setMessage('');
        await loadPosts();
      }
    } catch (err: any) {
      setError(err?.message || 'Transaction failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-bold tracking-wider">Guestbook</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => connect({
                onFinish: () => { window.location.reload(); },
                onCancel: () => {},
              })}
              className="px-6 py-2 rounded-full bg-[#181818] hover:bg-[#232323] text-gray-300 hover:text-white transition-all text-sm font-medium"
            >
              {address ? shortenAddr(address) : 'Connect Wallet'}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              On-chain Guestbook
            </h2>
            <p className="text-xl text-gray-300 font-light">
              Leave your mark on Stacks testnet
            </p>
          </div>

          {/* Post Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-12">
            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message... (max 200 chars)"
                maxLength={200}
                rows={3}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!address || !message.trim() || submitting}
                className="px-6 py-4 rounded-full bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-white font-medium transition-all active:scale-95 flex items-center gap-2"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing...
                  </span>
                ) : 'Sign & Post'}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
            {lastSubmit && (
              <p className="mt-3 text-sm text-emerald-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 8"><path d="M1.5 5.5l2.5 2.5 4-4"/></svg>
                Signed
              </p>
            )}
          </form>
          
          {/* Posts Feed */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">
                Recent entries
              </h2>
              <span className="text-sm text-violet-400 font-mono">{count} messages</span>
            </div>

            {!loaded ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
                    <div className="h-3 bg-white/10 rounded w-24 mb-3" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-white/40 text-lg mb-2">No messages yet</p>
                <p className="text-white/20 text-sm">Be the first to leave your mark on-chain</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, i) => (
                  <div
                    key={`${post.author}-${i}`}
                    className="group bg-white/5 border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">
                          {post.author.slice(2, 4).toUpperCase()}
                        </div>
                        <span className="text-sm font-mono text-white/50 group-hover:text-white/70 transition-colors">
                          {shortenAddr(post.author)}
                        </span>
                      </div>
                      <span className="text-xs text-white/20 font-mono">
                        #{post.timestamp}
                      </span>
                    </div>
                    <p className="text-white/80 leading-relaxed pl-10">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 mt-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
            <div className="flex items-center gap-4">
              <span>Stacks Testnet</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Clarity 6</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Scaffold Stacks</span>
            </div>
            <span>Built for Zero Authority DAO Bounty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
