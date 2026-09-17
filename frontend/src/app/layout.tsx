import type { ReactNode } from 'react';
import './globals.css';
import { WalletProvider } from '../components/WalletConnect';

export const metadata = {
  title: 'Stacks Guestbook - On-chain Messages',
  description: 'A permanent guestbook on Stacks. Every message is cryptographically signed, stored on Bitcoin security, and cannot be deleted.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-[#0a0a0f]">
      <body className="bg-[#0a0a0f] text-white">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
