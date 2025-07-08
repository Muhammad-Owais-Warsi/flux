import { useState, useEffect } from "react";
import Editor from "./components/editor";
import Landing from "./components/landing-page";
import { SidebarProvider } from "./components/ui/sidebar";
import "./App.css";

function App() {
  const [showLanding, setShowLanding] = useState<boolean>(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      setShowLanding(true);
    }
  }, []);

  const handleGetStarted = () => {
    setShowLanding(false);
  };


  if (showLanding) {
    return <Landing onGetStarted={handleGetStarted} />;
  }


  return (
    <div className="h-screen w-full">
      <SidebarProvider>
        <Editor/>
      </SidebarProvider>
    </div>
  );
}

export default App;
