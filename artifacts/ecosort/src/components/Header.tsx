import { Link } from 'wouter';
import { Leaf, Trophy, Home } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground tracking-tight">Eco<span className="text-primary">Sort</span></span>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link href="/" className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary-foreground hover:bg-secondary/40 rounded-full font-bold transition-colors">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Classifica</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
