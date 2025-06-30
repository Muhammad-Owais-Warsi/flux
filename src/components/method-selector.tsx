import { memo, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileStore } from "@/utils/zustand";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
];

const MethodSelector = memo(({ tabPath }: { tabPath?: string }) => {
  const { openTabs, updateTabRequestOptions } = useFileStore();

  const currentTab = useMemo(
    () => (tabPath ? openTabs.find((tab) => tab.path === tabPath) : null),
    [openTabs, tabPath],
  );

  const currentMethod = currentTab?.requestOptions.method || "GET";

  const handleMethodChange = useCallback(
    (newMethod: string) => {
      if (tabPath) {
        updateTabRequestOptions(tabPath, { method: newMethod });
      }
    },
    [tabPath, updateTabRequestOptions],
  );

  const memoizedMethods = useMemo(() => HTTP_METHODS, []);

  if (!tabPath || !currentTab) {
    return (
      <Select value="GET" disabled>
        <SelectTrigger className="w-[110px] h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={currentMethod} onValueChange={handleMethodChange}>
      <SelectTrigger className="w-[110px] h-9 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {memoizedMethods.map((method) => (
          <SelectItem key={method} value={method}>
            {method}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default MethodSelector;
