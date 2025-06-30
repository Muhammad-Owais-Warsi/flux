import { createContext } from "react";

export const FolderContext = createContext<{
  selectedFolder: string;
  setSelectedFolder: (path: string) => void;
}>({
  selectedFolder: '',
  setSelectedFolder: () => {}
}); 