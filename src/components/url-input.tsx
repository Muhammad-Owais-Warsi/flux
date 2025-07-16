import { memo, useCallback, useMemo } from "react";
import { Input } from "./ui/input";
import { useFileStore } from "@/utils/zustand";

const UrlInput = memo(({ tabPath }: { tabPath?: string }) => {
  const { openTabs, updateTabRequestOptions } = useFileStore();

  const currentTab = useMemo(
    () => (tabPath ? openTabs.find((tab) => tab.path === tabPath) : null),
    [openTabs, tabPath]
  );

  const currentUrl = currentTab?.requestOptions.url || "";
  const placeholder = "Enter request URL...";

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (tabPath) {
        updateTabRequestOptions(tabPath, { url: e.target.value });
      }
    },
    [tabPath, updateTabRequestOptions]
  );

  if (!tabPath || !currentTab) {
    return (
      <Input
        placeholder={placeholder}
        className="flex-1 h-9 text-sm"
        disabled
        value=""
      />
    );
  }

  return (
    <Input
      placeholder={placeholder}
      value={currentUrl}
      onChange={handleUrlChange}
      className="flex-1 h-9 text-sm"
    />
  );
});

export default UrlInput;
