// import { ReactNode, memo } from "react"
// import { Edit, Trash2, FileText, Folder } from "lucide-react"
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
//   ContextMenuSeparator,
// } from "@/components/ui/context-menu"
// import { useGlobalStore } from "@/utils/store"
// import { create } from "@/utils/id"

// interface EditorContextMenuProps {
//   children: ReactNode
//   type?: "folder" | "file" | "workspace"
//   folderId?: string
//   fileId?: string
//   itemName?: string
// }

// const EditorContextMenu = memo(({ 
//   children, 
//   type = "workspace", 
//   folderId = "__root__", 
//   fileId, 
//   itemName = "" 
// }: EditorContextMenuProps) => {

//   const { addFolder, addFile, removeFile, renameFolder, removeFolder, renameFile, lastClickedFolder, setActiveFile } = useGlobalStore();

//   const handleCreateFolder = () => {
//     const id = create() + "-folder"
//     const name = prompt("Enter folder name:", "New Folder")
//     if (name && name.trim()) {
//       const targetFolderId = type === "workspace" 
//         ? (lastClickedFolder.id || "true-root") 
//         : folderId;
//       addFolder(targetFolderId, id, name.trim())
//     }
//   }

//   const handleCreateFile = () => {
//     const fileId = create() + "-file"
//     const name = prompt("Enter request name:", "New Request")
//     if (name && name.trim()) {
//       const targetFolderId = type === "workspace" 
//         ? (lastClickedFolder.id || "true-root") 
//         : folderId;
//       addFile(targetFolderId, fileId, name.trim(), "GET")
//       setActiveFile(fileId)
//     }
//   }

//   const handleRename = () => {
//     const newName = prompt(`Rename ${type}:`, itemName)
//     if (newName && newName.trim()) {
//       if (type === "folder" && folderId) {
//         renameFolder(folderId, newName.trim())
//       } else if (type === "file" && fileId && folderId) {
//         renameFile(folderId, fileId, newName.trim())
//       }
//     }
//   }

//   const handleDelete = () => {
//     if (confirm(`Delete ${itemName}?`)) {
//       if (type === "folder" && folderId) {
//         removeFolder(folderId)
//       } else if (type === "file" && fileId && folderId) {
//         removeFile(folderId, fileId)
//       }
//     }
//   }

//   const handleAddFileToFolder = () => {
//     if (!folderId) return
    
//     const id = create() + "-file"
//     const name = prompt("Enter request name:", "New Request")
//     if (name && name.trim()) {
//       addFile(folderId, id, name.trim(), "GET")
//       setActiveFile(id)
//     }
//   }

//   const handleAddFolderToFolder = () => {
//     if (!folderId) return
    
//     const id = create() + "-folder"
//     const name = prompt("Enter folder name:", "New Folder")
//     if (name && name.trim()) {
//       addFolder(folderId, id, name.trim())
//     }
//   }

//   return (
//     <ContextMenu>
//       <ContextMenuTrigger asChild>
//         {children}
//       </ContextMenuTrigger>
//       <ContextMenuContent>
//         {type === "workspace" && (
//           <>
//             <ContextMenuItem onClick={handleCreateFolder}>
//               <Folder className="h-4 w-4 mr-2" />
//               New Folder
//             </ContextMenuItem>
//             <ContextMenuItem onClick={handleCreateFile}>
//               <FileText className="h-4 w-4 mr-2" />
//               New Request
//             </ContextMenuItem>
//           </>
//         )}
        
//         {type === "folder" && (
//           <>
//             <ContextMenuItem onClick={handleAddFileToFolder}>
//               <FileText className="h-4 w-4 mr-2" />
//               Add Request
//             </ContextMenuItem>
//             <ContextMenuItem onClick={handleAddFolderToFolder}>
//               <Folder className="h-4 w-4 mr-2" />
//               New Folder
//             </ContextMenuItem>
//             <ContextMenuSeparator />
//             <ContextMenuItem onClick={handleRename}>
//               <Edit className="h-4 w-4 mr-2" />
//               Rename
//             </ContextMenuItem>
//             <ContextMenuItem onClick={handleDelete} className="text-destructive">
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete
//             </ContextMenuItem>
//           </>
//         )}
        
//         {type === "file" && (
//           <>
//             <ContextMenuItem onClick={handleRename}>
//               <Edit className="h-4 w-4 mr-2" />
//               Rename
//             </ContextMenuItem>
//             <ContextMenuItem onClick={handleDelete} className="text-destructive">
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete
//             </ContextMenuItem>
//           </>
//         )}
//       </ContextMenuContent>
//     </ContextMenu>
//   )
// })

// EditorContextMenu.displayName = "EditorContextMenu"

// export default EditorContextMenu