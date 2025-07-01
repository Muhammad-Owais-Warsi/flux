import { memo, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useFileStore } from "@/utils/zustand";
import { invoke } from "@tauri-apps/api/core";

const SendButton = memo(({ tabPath }: { tabPath?: string }) => {
  const { openTabs } = useFileStore();


  const currentTab = useMemo(() => 
    tabPath ? openTabs.find(tab => tab.path === tabPath) : null, 
    [openTabs, tabPath]
  );

  const handleSend = useCallback(async () => {
    if (!currentTab) return;
    
    // Here you would implement the actual request sending logic
    console.log('Sending request for tab:', tabPath);
    console.log('Request options:', currentTab.requestOptions);
    
    if(currentTab.requestOptions.url) {
      const result = await invoke("make_request", {
        props: {
          url: currentTab.requestOptions.url,
          method: currentTab.requestOptions.method,
          request_config: {
            parameters: currentTab.requestOptions.parameters,
            body: currentTab.requestOptions.body,
            headers: currentTab.requestOptions.headers,
            authorisation: currentTab.requestOptions.authorisation
          }
        }
      })
      
      console.log(result);
    }
    
    // TODO:
    // - Validate request data
    // - Make HTTP request
    // - Handle response
    // - Update result in store
  }, [currentTab, tabPath]);

  const isDisabled = !currentTab || !currentTab.requestOptions.url;

  return (
    <Button 
      onClick={handleSend}
      disabled={isDisabled}
      className="h-9 px-4 gap-2"
    >
      <Send className="h-4 w-4" />
      Send
    </Button>
  );
});


export default SendButton; 