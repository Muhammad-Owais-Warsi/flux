import { create } from "zustand";
import database, { FileSystemItem } from "./data";

export type RequestOptions = {
  method: string;
  url: string | null;
  parameters: [string, string][] | null;
  body: string | null;
  headers: [string, string][] | null;
  authorisation: {
    auth_type: 'bearer' | 'basic';
    values: Record<string, string>;
  } | null;
};

export type Tab = {
  path: string;
  name: string;
  requestOptions: RequestOptions;
  isDirty: boolean;
};

type FileStore = {
  openTabs: Tab[];
  activeTab: string | null;
  activeFile: { path: string; name: string };
  result: any | null;
  isFileChanged: boolean;
  hasUnsyncedChanges: boolean;
  sidebarItems: FileSystemItem[];
  selectedFolder: string;

  // methods
  openTab: (file: string, name: string, requestOptions?: Partial<RequestOptions>) => Promise<void>;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabRequestOptions: (tabId: string, options: Partial<RequestOptions> ) => void;
  markTabDirty: (path: string, isDirty: boolean) => void;
  saveTabToFile: (parent: string,tabId: string) => Promise<void>;
  loadTabFromFile: (path: string) => Promise<RequestOptions | null>;
  setActiveFile: (path: string, name: string) => void;
};

export const useFileStore = create<FileStore>()((set, get) => ({
  openTabs: [],
  activeTab: null,
  activeFile: { path: "", name: "" },
  activeFileName: "",
  result: null,
  isFileChanged: false,
  hasUnsyncedChanges: false,
  sidebarItems: [],
  selectedFolder: "",

  openTab: async (path, name, content = {}) => {
    const state = get();

    const existingTab = state.openTabs.find((tab) => tab.path === path);

    if (existingTab) {
      set((state) => ({
        ...state,
        activeTab: path,
        activeFile: { path, name },
        activeFileName: name,
      }));
      return;
    }

    let finalRequestOptions = { ...content };
    try {
      const savedOptions = await get().loadTabFromFile(path);
      if (savedOptions) {
        finalRequestOptions = savedOptions;
        console.log(`Loaded saved data for tab: ${name}`);
      }
    } catch (error) {
      console.error("Failed to load saved tab data:", error);
    }

    // Create new tab with default or loaded request options
    const defaultRequestOptions: RequestOptions = {
      method: "GET",
      url: null,
      parameters: null,
      body: null,
      headers: null,
      authorisation: null,
    };

    const newTab: Tab = {
      path: path,
      name,
      requestOptions: { ...defaultRequestOptions, ...finalRequestOptions },
      isDirty: false,
    };

    set((state) => ({
      ...state,
      openTabs: [...state.openTabs, newTab],
      activeTab: path,
      activeFile: { path, name },
    }));
  },

  closeTab: (path) => {
    set((state) => {
      const tabIndex = state.openTabs.findIndex((tab) => tab.path === path);
      if (tabIndex === -1) return state;

      const newTabs = state.openTabs.filter((tab) => tab.path !== path);

      // If closing active tab, switch to another tab
      let newActiveTab = state.activeTab;
      let newActiveFile = state.activeFile;

      if (state.activeTab === path) {
        if (newTabs.length > 0) {
          // Switch to previous tab or first available
          const newActiveTabTemp = newTabs[Math.max(0, tabIndex - 1)];
          newActiveTab = newActiveTabTemp.path;
          newActiveFile = {
            path: newActiveTabTemp.path,
            name: newActiveTabTemp.name,
          };
        } else {
          // No tabs left
          newActiveTab = null;
          newActiveFile = { path: "", name: "" };
        }
      }

      return {
        ...state,
        openTabs: newTabs,
        activeTab: newActiveTab,
        activeFile: newActiveFile,
      };
    });
  },

  setActiveTab: (path) => {
    set((state) => {
      const tab = state.openTabs.find((t) => t.path === path);
      if (!tab) return state;

      return {
        ...state,
        activeTab: path,
        activeFile: { path, name: tab.name },
      };
    });
  },

  updateTabRequestOptions: (path, options) => {
    set((state) => {
      const currentTab = state.openTabs.find(tab => tab.path === path);
      if (!currentTab) return state;

      const newRequestOptions = { ...currentTab.requestOptions, ...options };
      
      const hasChanged = JSON.stringify(currentTab.requestOptions) !== JSON.stringify(newRequestOptions);
      
      return {
        ...state,
        openTabs: state.openTabs.map((tab) =>
          tab.path === path
            ? {
                ...tab,
                requestOptions: newRequestOptions,
                isDirty: hasChanged ? true : tab.isDirty,
              }
            : tab,
        ),
      };
    });
  },

  markTabDirty: (path, isDirty) => {
    set((state) => ({
      ...state,
      openTabs: state.openTabs.map((tab) =>
        tab.path === path ? { ...tab, isDirty } : tab,
      ),
    }));
  },

  saveTabToFile: async (parent, path) => {
    const state = get();
    const tab = state.openTabs.find((t) => t.path === path);
    if (!tab) return;

    try {
      const fileData = {
        name: tab.name,
        requestOptions: tab.requestOptions,
        savedAt: new Date().toISOString(),
      };

      const result  = await database.writeFile(parent, path, fileData);
      console.log(result);

      get().markTabDirty(path, false);

      console.log(`Tab "${tab.name}" saved to file`);
    } catch (error) {
      console.error("Failed to save tab to file:", error);
      throw error;
    }
  },

  // File operations (move to data.ts)
  loadTabFromFile: async (tabId) => {
    try {
      const fileKey = `file_${tabId.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const saved = localStorage.getItem(fileKey);

      if (saved) {
        const data = JSON.parse(saved);
        return data.requestOptions;
      }

      return null;
    } catch (error) {
      console.error("Failed to load tab from file:", error);
      return null;
    }
  },

  setActiveFile: (path, name) => {
    const state = get();
    const tab = state.openTabs.find((t) => t.path === path);
    if (tab) {
      get().setActiveTab(path);
    } else {
      set((state) => ({ ...state, activeFile: { path, name } }));
    }
  },
}));


// TODO
// now only refract code (utils done)(components left)(at last improve requestconfig)
// backend (rust)
