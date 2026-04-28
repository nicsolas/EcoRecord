import { ReactNode } from 'react';
import { Header } from './Header';
import { Countdown } from './Countdown';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Countdown />
      <Header />
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>
    </div>
  );
}
