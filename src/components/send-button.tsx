import { memo, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { Send, Loader2 } from "lucide-react";
import { useFileStore, HttpResponse } from "@/utils/zustand";
import { invoke } from "@tauri-apps/api/core";
import generate from "@/utils/code";

const SendButton = memo(({ tabPath }: { tabPath?: string }) => {
  const { openTabs, setResult, setLoading, setError, isLoading } = useFileStore();

  const currentTab = useMemo(() => 
    tabPath ? openTabs.find(tab => tab.path === tabPath) : null, 
    [openTabs, tabPath]
  );

  const handleSend = useCallback(async () => {
    if (!currentTab || isLoading) return;
    
    setResult(null);
    setError(null);
    setLoading(true);
    
    console.log(generate(currentTab.requestOptions));

    if(currentTab.requestOptions.url) {
      try {
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
        }) as HttpResponse;
        
        setResult(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [currentTab, tabPath, setResult, setLoading, setError, isLoading]);

  const isDisabled = !currentTab || !currentTab.requestOptions.url || isLoading;

  return (
    <Button 
      onClick={handleSend}
      disabled={isDisabled}
      className="h-9 px-4 gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {isLoading ? "Sending..." : "Send"}
    </Button>
  );
});

export default SendButton; 