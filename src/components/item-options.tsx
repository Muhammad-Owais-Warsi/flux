// import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useGlobalStore } from "@/utils/store"


// interface ItemOptionsProps {
//   type: "folder" | "file"
//   folderId: string
//   fileId?: string
//   itemName: string
// }

// export function ItemOptions({ type, folderId, fileId, itemName }: ItemOptionsProps) {
//   const { removeFolder, renameFolder, removeFile, renameFile, addFile } = useGlobalStore()

//   const handleRename = () => {
//     const newName = prompt(`Rename ${type}:`, itemName)
//     if (newName && newName.trim()) {
//       if (type === "folder") {
//         renameFolder(folderId, newName.trim())
//       } else if (fileId) {
//         renameFile(folderId, fileId, newName.trim())
//       }
//     }
//   }

//   const handleDelete = () => {
//     if (confirm(`Delete ${itemName}?`)) {
//       if (type === "folder") {
//         removeFolder(folderId)
//       } else if (fileId) {
//         removeFile(folderId, fileId)
//       }
//     }
//   }

//   const handleAddFile = () => {
//     const id = Date.now().toString()
//     addFile(folderId, id, `New Request`, "GET")
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-5 w-5 opacity-0 group-hover:opacity-100"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <MoreHorizontal className="h-3 w-3" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={handleRename}>
//           <Edit className="h-4 w-4 mr-2" />
//           Rename
//         </DropdownMenuItem>
//         {type === "folder" && (
//           <DropdownMenuItem onClick={handleAddFile}>
//             <FileText className="h-4 w-4 mr-2" />
//             Add Request
//           </DropdownMenuItem>
//         )}
//         <DropdownMenuItem onClick={handleDelete} className="text-destructive">
//           <Trash2 className="h-4 w-4 mr-2" />
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// } 