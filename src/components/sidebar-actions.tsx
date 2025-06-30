import { FileText, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo, useContext } from "react";
import database from "@/utils/data";
import { useFileStore } from "@/utils/zustand";
import { FolderContext } from "@/utils/folder-context";

interface SidebarActionsProps {
  onItemAdded?: (path: string, isFolder: boolean) => void;
}

export const SidebarActions = memo(({ onItemAdded }: SidebarActionsProps) => {
  const { setActiveFile } = useFileStore();
  const { selectedFolder } = useContext(FolderContext);

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:", "New Folder");
    if (folderName && folderName.trim()) {
      try {
        const success = await database.createFolder(
          selectedFolder,
          folderName.trim(),
        );
        if (success && onItemAdded) {
          const newPath = selectedFolder
            ? `${selectedFolder}/${folderName.trim()}`
            : folderName.trim();
          onItemAdded(newPath, true);
        }
      } catch (error) {
        console.error("Failed to create folder:", error);
        alert("Failed to create folder. Please try again.");
      }
    }
  };

  const handleCreateFile = async () => {
    const fileName = prompt("Enter request name:", "New Request");
    if (fileName && fileName.trim()) {
      try {
        const success = await database.createFile(
          selectedFolder,
          fileName.trim(),
        );
        if (success) {
          const newPath = selectedFolder
            ? `${selectedFolder}/${fileName.trim()}`
            : fileName.trim();
          setActiveFile(newPath, fileName.trim());
          if (onItemAdded) {
            onItemAdded(newPath, false);
          }
        }
      } catch (error) {
        console.error("Failed to create file:", error);
        alert("Failed to create file. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-200"
        onClick={handleCreateFolder}
        title={`Create Folder${selectedFolder ? ` in ${selectedFolder}` : ""}`}
      >
        <Folder className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-200"
        onClick={handleCreateFile}
        title={`Create File${selectedFolder ? ` in ${selectedFolder}` : ""}`}
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
});
