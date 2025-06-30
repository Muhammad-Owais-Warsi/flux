import { memo, useMemo, useCallback, useContext } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import MethodBadge from "./method-badge";
import { useFileStore } from "@/utils/zustand";
import { Button } from "./ui/button";
import database from "@/utils/data";
import { FolderContext } from "@/utils/folder-context";


const TabItem = memo(({ 
  tab, 
  isActive, 
  onClose, 
  onSelect 
}: { 
  tab: { path: string; name: string; requestOptions: { method: string } }; 
  isActive: boolean;
  onClose: (tabId: string) => void;
  onSelect: (tabId: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(tab.path);
  }, [onSelect, tab.path]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(tab.path);
  }, [onClose, tab.path]);

  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1 border-r border-border cursor-pointer group min-w-0 max-w-48",
        isActive 
          ? "bg-background border-b-2 border-b-primary text-primary shadow-sm" 
          : "bg-muted/20 hover:bg-background/50 text-muted-foreground hover:text-foreground"
      )}
      onClick={handleClick}
    >
      <MethodBadge method={tab.requestOptions.method} />
      
      <div className={cn(
        "text-sm whitespace-nowrap truncate flex-1 min-w-0",
        isActive ? "text-primary font-medium" : "text-foreground"
      )}>
        {tab.name}
      </div>
    
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary flex-shrink-0 opacity-0 group-hover:opacity-100"
        onClick={handleClose}
      >
        <X className={cn(
          "h-3 w-3 ",
          isActive ? "text-primary/70 hover:text-primary" : "text-muted-foreground hover:text-primary"
        )} />
      </Button>
    </div>
  );
});


export const EditorHeader = memo(() => {
  const { openTabs, activeTab, closeTab, setActiveTab, openTab } = useFileStore();
  
  const { selectedFolder } = useContext(FolderContext)

  const handleCloseTab = useCallback((tabId: string) => {
    closeTab(tabId);
  }, [closeTab]);

  const handleSelectTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  const handleCreateNewTab = useCallback(async () => {
    try {
      const timestamp = Date.now();
      const name = `new-request-${timestamp}`;
      
      // Create the file in the filesystem
      const success = await database.createFile(selectedFolder, name);
      
      if (success) {
        // Construct the correct path
        const filePath = selectedFolder ? `${selectedFolder}/${name}` : name;
        
        // Open the file as a tab with default request options
        await openTab(filePath, name, {
          method: 'GET',
          url: null,
          parameters: null,
          body: null,
          headers: null,
          authorisation: null
        });
        
        console.log(`Created and opened new tab: ${name}`);
      } else {
        console.error("Failed to create file");
      }
    } catch (error) {
      console.error("Error creating new tab:", error);
    }
  }, [selectedFolder, openTab]);

  const memoizedTabs = useMemo(() => {
    return openTabs.map((tab) => (
      <TabItem
        key={tab.path}
        tab={tab}
        isActive={activeTab === tab.path}
        onClose={handleCloseTab}
        onSelect={handleSelectTab}
      />
    ));
  }, [openTabs, activeTab, handleCloseTab, handleSelectTab]);

  return (
    <div className="flex h-8 bg-muted/30 border-border overflow-hidden flex-shrink-0">
      <div className="flex overflow-x-auto overflow-y-hidden flex-1 min-w-0 scrollbar-none">
        <div className="flex min-w-max">
          {memoizedTabs}
        </div>
      </div>
      
      <div
        className="flex items-center gap-1 px-2 py-1 border-l border-border bg-background hover:bg-accent cursor-pointer group shrink-0"
        onClick={handleCreateNewTab}
      >
        <Plus className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
        <span className="text-xs text-muted-foreground group-hover:text-foreground">
          New Tab
        </span>
      </div>
    </div>
  );
});


