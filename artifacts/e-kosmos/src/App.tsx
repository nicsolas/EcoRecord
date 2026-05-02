import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

// Pages
import Home from "@/pages/Home";
import GameStart from "@/pages/GameStart";
import Game from "@/pages/Game";
import Results from "@/pages/Results";
import Leaderboard from "@/pages/Leaderboard";
import Scan from "@/pages/Scan";
import Trainer from "@/pages/Trainer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/gioca" component={GameStart} />
        <Route path="/play" component={Game} />
        <Route path="/results" component={Results} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/scan" component={Scan} />
        <Route path="/trainer" component={Trainer} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={base}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
