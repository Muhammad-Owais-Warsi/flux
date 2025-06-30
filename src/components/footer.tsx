import { memo, useCallback } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "./theme-toggle";
import { ResultToggle } from "./result-toggle";

export const Footer = memo(() => {
  const { toggleSidebar } = useSidebar();

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <footer className="flex justify-between items-center p-4 border-t bg-background h-14 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleToggleSidebar}>
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ResultToggle />
        <ModeToggle />
      </div>
    </footer>
  );
});


