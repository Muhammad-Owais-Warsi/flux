import * as React from "react";
import { ChevronRight, Folder, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarActions } from "./sidebar-actions";
import MethodBadge from "./method-badge";
import { cn } from "@/lib/utils";
import { useEffect, useState, useContext } from "react";
import database, { FileSystemItem } from "@/utils/data";
import { useFileStore } from "@/utils/zustand";
import { FolderContext } from "@/utils/folder-context";

const FileItem = React.memo(
  ({
    item,
    depth = 0,
    onItemDeleted,
  }: {
    item: FileSystemItem;
    depth?: number;
    onItemDeleted?: (path: string) => void;
  }) => {
    const { activeFile, openTab, closeTab } = useFileStore();

    const handleClick = async () => {
      await openTab(item.path, item.name, item.requestOptions);
    };

    const handleDelete = async () => {
      try {
        const fileExists = await database.fileExists("", item.path);

        if (fileExists) {
          const success = await database.deleteItem("", item.path);
          if (!success) {
            throw new Error("Failed to delete file from filesystem");
          }
        }

        closeTab(item.path);
        if (onItemDeleted) {
          onItemDeleted(item.path);
        }
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Failed to delete item. Please try again.");
      }
    };

    const isActive = activeFile.path === item.path;

    const displayName =
      item.requestOptions?.url && item.requestOptions.url.trim()
        ? item.requestOptions.url
        : item.name;

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleClick}
          className={cn(
            "cursor-pointer",
            isActive
              ? "bg-primary/10 text-primary border-l-2 border-l-primary"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
          style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        >
          <MethodBadge method={item.requestOptions?.method} />
          <span className="truncate flex-1 min-w-0" title={displayName}>
            {displayName}
          </span>
        </SidebarMenuButton>
        <SidebarMenuAction showOnHover onClick={handleDelete}>
          <X className="h-4 w-4" />
        </SidebarMenuAction>
      </SidebarMenuItem>
    );
  }
);

const FolderItem = React.memo(
  ({
    item,
    depth = 0,
    onItemDeleted,
  }: {
    item: FileSystemItem;
    depth?: number;
    onItemDeleted?: (path: string) => void;
  }) => {
    const { selectedFolder, setSelectedFolder } = useContext(FolderContext);
    const displayName = item.name;

    const handleFolderClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFolder(item.path);
    };

    const isSelected = selectedFolder === item.path;

    const handleDelete = async () => {
      try {
        // Check if folder exists before attempting to delete
        const folderExists = await database.fileExists("", item.path);

        if (folderExists) {
          // Folder exists in filesystem, delete it
          const success = await database.deleteItem("", item.path);
          if (!success) {
            throw new Error("Failed to delete folder from filesystem");
          }
        }

        // Always remove from UI regardless of filesystem state
        if (onItemDeleted) {
          onItemDeleted(item.path);
        }
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Failed to delete item. Please try again.");
      }
    };

    return (
      <SidebarMenuItem>
        <Collapsible
          className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          defaultOpen={depth === 0}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={handleFolderClick}
              className={cn(
                "cursor-pointer",
                isSelected
                  ? "bg-accent/50 text-accent-foreground ring-1 ring-accent"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <ChevronRight className="transition-transform h-4 w-4 flex-shrink-0" />
              <Folder className="h-4 w-4 flex-shrink-0" />
              <span className="truncate flex-1 min-w-0" title={displayName}>
                {displayName}
              </span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((child) =>
                child.isDirectory ? (
                  <FolderItem
                    key={child.path}
                    item={child}
                    depth={depth + 1}
                    onItemDeleted={onItemDeleted}
                  />
                ) : (
                  <FileItem
                    key={child.path}
                    item={child}
                    depth={depth}
                    onItemDeleted={onItemDeleted}
                  />
                )
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
        <SidebarMenuAction showOnHover onClick={handleDelete}>
          <X className="h-4 w-4" />
        </SidebarMenuAction>
      </SidebarMenuItem>
    );
  }
);

const SidebarHeader = React.memo(
  ({
    onItemAdded,
  }: {
    onItemAdded?: (path: string, isFolder: boolean) => void;
  }) => {
    const { selectedFolder } = useContext(FolderContext);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarActions onItemAdded={onItemAdded} />
        </div>
        {selectedFolder && (
          <div className="px-2 py-1 text-xs text-muted-foreground bg-accent/20 rounded truncate">
            Selected: {selectedFolder}
          </div>
        )}
      </div>
    );
  }
);

export const EditorSidebar = React.memo(
  ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const [rawItems, setRawItems] = useState<FileSystemItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFolder, setSelectedFolder] = useState<string>("");

    const { openTabs } = useFileStore();

    const fetchData = React.useCallback(async () => {
      try {
        setLoading(true);
        const folderData = await database.readFolder();
        setRawItems(folderData);
      } catch (error) {
        console.error("Error fetching folders:", error);
        setRawItems([]);
      } finally {
        setLoading(false);
      }
    }, []);

    const items = React.useMemo(() => {
      if (openTabs.length === 0) return rawItems;

      const tabMap = new Map(openTabs.map((tab) => [tab.path, tab]));

      const findItemInTree = (
        items: FileSystemItem[],
        path: string
      ): boolean => {
        return items.some((item) => {
          if (item.path === path) return true;
          if (item.children) return findItemInTree(item.children, path);
          return false;
        });
      };

      const newTabsToAdd = openTabs.filter(
        (tab) => !findItemInTree(rawItems, tab.path)
      );

      if (newTabsToAdd.length > 0) {
        setTimeout(() => {
          newTabsToAdd.forEach((tab) => {
            const pathParts = tab.path.split("/");
            const fileName = pathParts[pathParts.length - 1];
            const parentPath = pathParts.slice(0, -1).join("/");

            setRawItems((prevItems) => {
              const updateItems = (
                items: FileSystemItem[]
              ): FileSystemItem[] => {
                return items.map((item) => {
                  if (item.isDirectory && item.path === parentPath) {
                    // Check if item already exists
                    const itemExists = item.children?.some(
                      (child) => child.path === tab.path
                    );
                    if (!itemExists) {
                      const newItem: FileSystemItem = {
                        name: fileName,
                        path: tab.path,
                        isDirectory: false,
                        requestOptions: tab.requestOptions,
                      };
                      return {
                        ...item,
                        children: [...(item.children || []), newItem],
                      };
                    }
                  } else if (item.isDirectory && item.children) {
                    return {
                      ...item,
                      children: updateItems(item.children),
                    };
                  }
                  return item;
                });
              };

              if (parentPath === "") {
                const itemExists = prevItems.some(
                  (item) => item.path === tab.path
                );
                if (!itemExists) {
                  const newItem: FileSystemItem = {
                    name: fileName,
                    path: tab.path,
                    isDirectory: false,
                    requestOptions: tab.requestOptions,
                  };
                  return [...prevItems, newItem];
                }
                return prevItems;
              }

              return updateItems(prevItems);
            });
          });
        }, 0);
      }

      const mergeItems = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map((item) => {
          if (!item.isDirectory) {
            const openTab = tabMap.get(item.path);
            if (openTab && item.requestOptions) {
              // Check if any request options have changed
              const hasChanged =
                JSON.stringify(item.requestOptions) !==
                JSON.stringify(openTab.requestOptions);
              if (hasChanged) {
                return {
                  ...item,
                  requestOptions: openTab.requestOptions,
                };
              }
            }
          } else if (item.children) {
            const updatedChildren = mergeItems(item.children);
            if (updatedChildren !== item.children) {
              return { ...item, children: updatedChildren };
            }
          }
          return item;
        });
      };

      return mergeItems(rawItems);
    }, [rawItems, openTabs]);

    // to add files and folders
    const addItemToStructure = React.useCallback(
      (newItemPath: string, isFolder: boolean) => {
        const pathParts = newItemPath.split("/");
        const fileName = pathParts[pathParts.length - 1];
        const parentPath = pathParts.slice(0, -1).join("/");

        setRawItems((prevItems) => {
          const updateItems = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.map((item) => {
              if (item.isDirectory && item.path === parentPath) {
                const newItem: FileSystemItem = {
                  name: fileName,
                  path: newItemPath,
                  isDirectory: isFolder,
                  ...(isFolder
                    ? {}
                    : {
                        requestOptions: {
                          method: "GET",
                          url: null,
                          parameters: null,
                          body: null,
                          headers: null,
                          authorisation: null,
                        },
                      }),
                };
                return {
                  ...item,
                  children: [...(item.children || []), newItem],
                };
              } else if (item.isDirectory && item.children) {
                return {
                  ...item,
                  children: updateItems(item.children),
                };
              }
              return item;
            });
          };

          if (parentPath === "") {
            const newItem: FileSystemItem = {
              name: fileName,
              path: newItemPath,
              isDirectory: isFolder,
              ...(isFolder
                ? {}
                : {
                    requestOptions: {
                      method: "GET",
                      url: null,
                      parameters: null,
                      body: null,
                      headers: null,
                      authorisation: null,
                    },
                  }),
            };
            return [...prevItems, newItem];
          }

          return updateItems(prevItems);
        });
      },
      []
    );

    // to remove files and folders
    const removeItemFromStructure = React.useCallback((itemPath: string) => {
      setRawItems((prevItems) => {
        const removeFromItems = (items: FileSystemItem[]): FileSystemItem[] => {
          return items
            .filter((item) => item.path !== itemPath)
            .map((item) => {
              if (item.isDirectory && item.children) {
                return {
                  ...item,
                  children: removeFromItems(item.children),
                };
              }
              return item;
            });
        };

        return removeFromItems(prevItems);
      });
    }, []);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const memoizedItems = React.useMemo(
      () =>
        items.map((item) =>
          item.isDirectory ? (
            <FolderItem
              key={item.path}
              item={item}
              depth={0}
              onItemDeleted={removeItemFromStructure}
            />
          ) : (
            <FileItem
              key={item.path}
              item={item}
              depth={0}
              onItemDeleted={removeItemFromStructure}
            />
          )
        ),
      [items, removeItemFromStructure]
    );

    const folderContextValue = React.useMemo(
      () => ({
        selectedFolder,
        setSelectedFolder,
      }),
      [selectedFolder]
    );

    const handleWorkspaceClick = React.useCallback(() => {
      setSelectedFolder("");
    }, []);

    return (
      <FolderContext.Provider value={folderContextValue}>
        <Sidebar {...props}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarHeader onItemAdded={addItemToStructure} />
              <SidebarGroupContent>
                <SidebarMenu>
                  <div
                    className="space-y-1 min-h-[200px]"
                    onClick={handleWorkspaceClick}
                  >
                    {loading ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Loading...
                      </div>
                    ) : items.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No files or folders found
                      </div>
                    ) : (
                      memoizedItems
                    )}
                  </div>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      </FolderContext.Provider>
    );
  }
);
