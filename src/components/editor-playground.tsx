import { memo, useMemo } from "react";
import MethodSelector from "./method-selector";
import UrlInput from "./url-input";
import SendButton from "./send-button";
import { SyncButton } from "./sync-button";
import { Separator } from "./ui/separator";
import { RequestConfig } from "./request-config";
import { useFileStore } from "@/utils/zustand";


const TabPlayground = memo(({ tabPath }: { tabPath: string }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 bg-background overflow-hidden">
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <MethodSelector tabPath={tabPath} />
          <UrlInput tabPath={tabPath} />
          <div className="flex items-center gap-2">
            <SyncButton tabPath={tabPath} />
            <SendButton tabPath={tabPath} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-hidden">
        <RequestConfig tabPath={tabPath} />
      </div>
    </div>
  );
});


const EditorPlayground = memo(() => {
  const { activeTab, openTabs } = useFileStore();


  const renderContent = useMemo(() => {
    if (!activeTab || openTabs.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No tab open</p>
            <p className="text-sm">Click on a file in the sidebar to get started</p>
          </div>
        </div>
      );
    }

    return <TabPlayground tabPath={activeTab} />;
  }, [activeTab, openTabs.length]);

  return renderContent;
});

export default EditorPlayground;
