import { memo, useState, useMemo, useCallback } from "react";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFileStore } from "@/utils/zustand";
import generate from "@/utils/code";

export const CodeSnippets = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const { activeTab, openTabs } = useFileStore();

  const currentTab = useMemo(
    () => (activeTab ? openTabs.find((tab) => tab.path === activeTab) : null),
    [openTabs, activeTab],
  );

  const snippets = useMemo(() => {
    if (!currentTab?.requestOptions) return [];
    return generate(currentTab.requestOptions);
  }, [currentTab?.requestOptions]);

  const handleCopy = useCallback(async (snippetName: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates((prev) => ({ ...prev, [snippetName]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [snippetName]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, []);

  const isDisabled = !currentTab || !currentTab.requestOptions.url;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isDisabled}>
          <Code className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">View code snippets</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Snippets
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 min-h-0">
          {snippets.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No request selected</p>
              <p className="text-sm">
                Select a request to generate code snippets
              </p>
            </div>
          ) : (
            snippets.map((snippet) => (
              <div key={snippet.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold capitalize">
                      {snippet.name}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(snippet.name, snippet.code)}
                    className="h-8 px-3 gap-1"
                  >
                    {copiedStates[snippet.name] ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/20">
                    <pre className="p-4 text-sm font-mono overflow-x-auto text-foreground leading-relaxed max-h-[300px] overflow-y-auto">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

CodeSnippets.displayName = "CodeSnippets";
