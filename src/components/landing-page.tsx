import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (hasVisited) {
      setIsFirstTime(false);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("hasVisitedBefore", "true");
    setIsFirstTime(false);
    onGetStarted();
  };


  if (!isFirstTime) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <img 
                src="" 
                alt="Flux Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-12 h-12 text-primary">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-foreground font-serif tracking-tight">
                Flux
              </h1>
              <p className="text-xl text-muted-foreground font-mono font-light">
                Lightweight API client.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="px-12 py-4 text-lg font-medium rounded-xl hover:cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}