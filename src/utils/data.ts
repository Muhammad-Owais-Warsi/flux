import {
  readDir,
  mkdir,
  remove,
  BaseDirectory,
  exists,
  readTextFile,
  writeFile,
} from "@tauri-apps/plugin-fs";
import { RequestOptions } from "./zustand";

export type FileSystemItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileSystemItem[];
  requestOptions?: RequestOptions;
};

class FileManagement {
  private basePath = "flux-db";

  createFolder = async (parent: string, name: string): Promise<boolean> => {
    try {
      const path =
        parent === ""
          ? `${this.basePath}/${name}`
          : `${this.basePath}/${parent}/${name}`;

      await mkdir(path, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
      return true;
    } catch (e) {
      console.error("Failed to create folder:", e);
      return false;
    }
  };

  createFile = async (parent: string, name: string): Promise<boolean> => {
    try {
      await this.ensureBaseDirectory();

      const path =
        parent === ""
          ? `${this.basePath}/${name}`
          : `${this.basePath}/${parent}/${name}`;

      const defaultData = {
        name: name,
        requestOptions: {
          method: "GET",
          url: null,
          parameters: null,
          body: null,
          headers: null,
          authorisation: null,
        },
        savedAt: new Date().toISOString(),
      };
      const jsonString = JSON.stringify(defaultData);

      const encoder = new TextEncoder();
      const binaryData = encoder.encode(jsonString);

      await writeFile(path, binaryData, {
        baseDir: BaseDirectory.AppData,
      });

      return true;
    } catch (e) {
      console.error("Failed to create file:", e);
      return false;
    }
  };

  writeFile = async (
    parent: string,
    name: string,
    fileContent: any
  ): Promise<boolean> => {
    try {
      const path =
        parent === ""
          ? `${this.basePath}/${name}`
          : `${this.basePath}/${parent}/${name}`;

      const jsonString = JSON.stringify(fileContent, null, 2);
      const encoder = new TextEncoder();
      const binaryContent = encoder.encode(jsonString);

      await writeFile(path, binaryContent, {
        baseDir: BaseDirectory.AppData,
      });

      return true;
    } catch (err) {
      console.error("Failed to save file:", err);
      return false;
    }
  };

  deleteItem = async (parent: string, path: string): Promise<boolean> => {
    try {
      const fullPath =
        parent === ""
          ? `${this.basePath}/${path}`
          : `${this.basePath}/${parent}/${path}`;

      await remove(fullPath, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
      return true;
    } catch (e) {
      console.error("Failed to delete item:", e);
      return false;
    }
  };

  fileExists = async (parent: string, path: string): Promise<boolean> => {
    try {
      const fullPath =
        parent === ""
          ? `${this.basePath}/${path}`
          : `${this.basePath}/${parent}/${path}`;

      const fileExists = await exists(fullPath, {
        baseDir: BaseDirectory.AppData,
      });

      return fileExists;
    } catch (e) {
      console.error("Failed to check if file exists:", e);
      return false;
    }
  };

  readFolder = async (): Promise<FileSystemItem[]> => {
    try {
      await this.ensureBaseDirectory();

      const entries = await readDir(this.basePath, {
        baseDir: BaseDirectory.AppData,
      });

      return await this.processEntriesRecursively("", entries);
    } catch (e) {
      console.error("Failed to read folder:", e);
      return [];
    }
  };

  private processEntriesRecursively = async (
    parent: string,
    entries: any[]
  ): Promise<FileSystemItem[]> => {
    const items: FileSystemItem[] = [];

    for (const entry of entries) {
      const currentPath = parent ? `${parent}/${entry.name}` : entry.name;

      if (entry.isDirectory) {
        try {
          const subDir = parent
            ? `${this.basePath}/${parent}/${entry.name}`
            : `${this.basePath}/${entry.name}`;
          const subEntries = await readDir(subDir, {
            baseDir: BaseDirectory.AppData,
          });

          const children = await this.processEntriesRecursively(
            currentPath,
            subEntries
          );

          items.push({
            name: entry.name,
            path: currentPath,
            isDirectory: true,
            children,
          });
        } catch (e) {
          console.error(`Failed to read subdirectory ${currentPath}:`, e);
          items.push({
            name: entry.name,
            path: currentPath,
            isDirectory: true,
            children: [],
          });
        }
      } else {
        try {
          const filePath = parent
            ? `${this.basePath}/${parent}/${entry.name}`
            : `${this.basePath}/${entry.name}`;
          const contentString = await readTextFile(filePath, {
            baseDir: BaseDirectory.AppData,
          });
          const content = JSON.parse(contentString);
          items.push({
            name: entry.name,
            path: currentPath,
            isDirectory: false,
            requestOptions: content.requestOptions || content,
          });
        } catch (e) {
          console.error(`Failed to read file ${entry.name}:`, e);
          items.push({
            name: entry.name,
            path: currentPath,
            isDirectory: false,
          });
        }
      }
    }

    return items;
  };

  private ensureBaseDirectory = async (): Promise<void> => {
    try {
      const baseExists = await exists(this.basePath, {
        baseDir: BaseDirectory.AppData,
      });

      if (!baseExists) {
        await mkdir(this.basePath, {
          baseDir: BaseDirectory.AppData,
          recursive: true,
        });
      }
    } catch (e) {
      console.error("Failed to ensure base directory:", e);
      throw e;
    }
  };

  initializeBaseDirectory = async (): Promise<boolean> => {
    try {
      await this.ensureBaseDirectory();
      return true;
    } catch (e) {
      console.error("Failed to initialize base directory:", e);
      return false;
    }
  };
}

const database = new FileManagement();

export default database;
