import { readDir, mkdir, remove, BaseDirectory, exists, create, readTextFile, writeFile } from '@tauri-apps/plugin-fs';
import { RequestOptions } from './zustand';



export type FileSystemItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileSystemItem[];
  content?: RequestOptions;
};

class FileManagement {
  private basePath = "testing-tauri";

  createFolder = async (parent: string, name: string): Promise<boolean> => {
    try {
      const path = parent === '' ? `${this.basePath}/${name}` : `${this.basePath}/${parent}/${name}`;
      
      await mkdir(path, {
        baseDir: BaseDirectory.Document,
        recursive: true,
      });
      return true;
    } catch (e) {
      console.error('Failed to create folder:', e);
      return false;
    }
  };

  createFile = async (parent: string, name: string): Promise<boolean> => {
    try {

      await this.ensureBaseDirectory();
      
      const path = parent === '' ? `${this.basePath}/${name}` : `${this.basePath}/${parent}/${name}`;

      await create(path, {
        baseDir: BaseDirectory.Document,
      });

      return true;
    } catch (e) {
      console.error('Failed to create file:', e);
      return false;
    }
  };
  
  writeFile = async (parent: string, name: string, fileContent: any): Promise<boolean> => {
    try {
      
      const path = parent === '' ? `${this.basePath}/${name}` : `${this.basePath}/${parent}/${name}`;
      
      const jsonString = JSON.stringify(fileContent, null, 2);
      const encoder = new TextEncoder();
      const binaryContent = encoder.encode(jsonString);
  
      await writeFile(path, binaryContent, {
        baseDir: BaseDirectory.Document
      })
      
      return true;
    } catch(err) {
      return false
    }
  }
  
  deleteItem = async (path: string): Promise<boolean> => {
    try {
      const fullPath = `${this.basePath}/${path}`;
      console.log('Deleting item at path:', fullPath);
      
      await remove(fullPath, {
        baseDir: BaseDirectory.Document,
        recursive: true,
      });
      return true;
    } catch (e) {
      console.error('Failed to delete item:', e);
      return false;
    }
  };

  readFolder = async (): Promise<FileSystemItem[]> => {
    try {
      await this.ensureBaseDirectory();
      
      const entries = await readDir(this.basePath, { 
        baseDir: BaseDirectory.Document 
      });
      
      return await this.processEntriesRecursively('', entries);
    } catch (e) {
      console.error('Failed to read folder:', e);
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
          const subDir = parent ? `${this.basePath}/${parent}/${entry.name}` : `${this.basePath}/${entry.name}`;
          const subEntries = await readDir(subDir, { 
            baseDir: BaseDirectory.Document 
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
          const filePath = parent ? `${this.basePath}/${parent}/${entry.name}` : `${this.basePath}/${entry.name}`;
          const contentString = await readTextFile(filePath, {
            baseDir: BaseDirectory.Document
          });
          const content = JSON.parse(contentString);
          items.push({
            name: entry.name,
            path: currentPath,
            isDirectory: false,
            content: content
          });
        } catch (e) {
          console.error(`Failed to read file ${entry.name}:`, e);
          // Add file without content if reading fails
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
        baseDir: BaseDirectory.Document,
      });
      
      if (!baseExists) {
        console.log('Creating base directory:', this.basePath);
        await mkdir(this.basePath, {
          baseDir: BaseDirectory.Document,
          recursive: true,
        });
      }
    } catch (e) {
      console.error('Failed to ensure base directory:', e);
      throw e;
    }
  };

  initializeBaseDirectory = async (): Promise<boolean> => {
    try {
      await this.ensureBaseDirectory();
      return true;
    } catch (e) {
      console.error('Failed to initialize base directory:', e);
      return false;
    }
  };
}

const database = new FileManagement();

export default database;