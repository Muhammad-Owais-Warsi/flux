import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Check } from "lucide-react";
import { useFileStore } from "@/utils/zustand";
import { useContext } from "react";
import { FolderContext } from "@/utils/folder-context";
import database from "@/utils/data";

export const SyncButton = memo(({ tabPath }: { tabPath?: string }) => {
  const { openTabs, saveTabToFile } = useFileStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isFileSaved, setIsFileSaved] = useState(false);

  const { selectedFolder } = useContext(FolderContext);

  const currentTab = useMemo(
    () => (tabPath ? openTabs.find((tab) => tab.path === tabPath) : null),
    [openTabs, tabPath]
  );

  const checkFileExists = useCallback(async () => {
    if (!currentTab || !tabPath) {
      setIsFileSaved(false);
      return;
    }

    try {
      const exists = await database.fileExists(selectedFolder || "", tabPath);
      setIsFileSaved(exists);
    } catch (error) {
      console.error("Failed to check file existence:", error);
      setIsFileSaved(false);
    }
  }, [currentTab, tabPath, selectedFolder]);

  useEffect(() => {
    setIsFileSaved(false);
    checkFileExists();
  }, [tabPath, checkFileExists]);

  const handleSync = useCallback(async () => {
    if (!currentTab || !tabPath) return;

    setIsSaving(true);
    try {
      await saveTabToFile(selectedFolder || "", tabPath);

      setIsFileSaved(true);
    } catch (error) {
      console.error("Failed to save tab:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentTab, tabPath, saveTabToFile, selectedFolder]);

  const isDisabled = !currentTab || isSaving;
  const showDirtyIndicator = currentTab?.isDirty;

  const isSavedState = isFileSaved && !showDirtyIndicator;

  return (
    <Button
      variant={
        showDirtyIndicator ? "secondary" : isSavedState ? "default" : "outline"
      }
      onClick={handleSync}
      disabled={isDisabled}
      className="h-9 px-3 gap-2"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSavedState ? (
        <Check className="h-4 w-4" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {isSaving ? "Saving..." : isSavedState ? "Saved" : "Save"}
      {showDirtyIndicator ? (
        <span className="w-2 h-2 bg-orange-500 rounded-full" />
      ) : null}
    </Button>
  );
});
