import { useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { SearchModal } from "@/components/SearchModal";
import NotFound from "@/pages/not-found";
import Portfolio from "@/pages/portfolio";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleSearchNavigate = useCallback(
    (path: string) => {
      setLocation(path);
    },
    [setLocation]
  );

  return (
    <>
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
      <Router />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
