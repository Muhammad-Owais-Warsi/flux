import { memo, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useFileStore } from "@/utils/zustand";
import { useContext } from "react";
import { FolderContext } from "@/utils/folder-context";

export const SyncButton = memo(({ tabPath }: { tabPath?: string }) => {
  const { openTabs, saveTabToFile } = useFileStore();
  const [isSaving, setIsSaving] = useState(false);

  const { selectedFolder } = useContext(FolderContext);

  const currentTab = useMemo(
    () => (tabPath ? openTabs.find((tab) => tab.path === tabPath) : null),
    [openTabs, tabPath],
  );

  const handleSync = useCallback(async () => {
    if (!currentTab || !tabPath) return;
    setIsSaving(true);
    try {
      await saveTabToFile(selectedFolder || "", tabPath);
      console.log(`Tab "${currentTab.name}" saved to file`);
    } catch (error) {
      console.error("Failed to save tab:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentTab, tabPath, saveTabToFile]);

  const isDisabled = !currentTab || isSaving;
  const showDirtyIndicator = currentTab?.isDirty;

  return (
    <Button
      variant={showDirtyIndicator ? "secondary" : "outline"}
      onClick={handleSync}
      disabled={isDisabled}
      className="h-9 px-3 gap-2"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {isSaving ? "Saving..." : "Save"}
      {showDirtyIndicator ? (
        <span className="w-2 h-2 bg-orange-500 rounded-full" />
      ) : null}
    </Button>
  );
});
