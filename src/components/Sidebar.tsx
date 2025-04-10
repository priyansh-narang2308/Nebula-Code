
import React, { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  File, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  Edit2,
  MoreVertical,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: FileSystemItem[];
}

interface SidebarProps {
  onFileSelect: (file: FileSystemItem) => void;
}

const getIconForFile = (file: FileSystemItem) => {
  if (file.type === "folder") {
    return null;
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'html':
      return <FileCode className="h-4 w-4 text-orange-400" />;
    case 'css':
    case 'scss':
      return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'py':
      return <FileCode className="h-4 w-4 text-green-400" />;
    case 'java':
      return <FileCode className="h-4 w-4 text-red-400" />;
    case 'md':
    case 'txt':
      return <FileText className="h-4 w-4 text-gray-400" />;
    default:
      return <File className="h-4 w-4 text-gray-400" />;
  }
};

// Custom random ID generator
const generateId = () => Math.random().toString(36).substring(2, 10);

const initialFiles: FileSystemItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "2", name: "index.js", type: "file", language: "javascript" },
      { id: "3", name: "styles.css", type: "file", language: "css" },
      { 
        id: "4", 
        name: "components", 
        type: "folder",
        children: [
          { id: "5", name: "Button.jsx", type: "file", language: "jsx" },
          { id: "6", name: "Card.jsx", type: "file", language: "jsx" }
        ]
      }
    ]
  },
  {
    id: "7",
    name: "public",
    type: "folder",
    children: [
      { id: "8", name: "index.html", type: "file", language: "html" },
    ]
  },
  { id: "9", name: "README.md", type: "file", language: "markdown" },
  { id: "10", name: "package.json", type: "file", language: "json" }
];

interface FileExplorerProps {
  items: FileSystemItem[];
  level?: number;
  onFileSelect: (file: FileSystemItem) => void;
  setFiles: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
  parentPath?: string[];
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  items, 
  level = 0, 
  onFileSelect,
  setFiles,
  parentPath = []
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "1": true, // Auto-expand src folder
    "4": true  // Auto-expand components folder
  });
  const [isCreatingFile, setIsCreatingFile] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const { toast } = useToast();
  
  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleDelete = (item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get the full path to the item
    const fullPath = [...parentPath];
    
    // Handle deletion recursively
    const deleteItem = (items: FileSystemItem[], path: string[] = []): FileSystemItem[] => {
      if (path.length === 0) {
        // We're at the correct level, filter out the item we want to delete
        return items.filter(i => i.id !== item.id);
      }
      
      // Find the folder we need to descend into
      const folderId = path[0];
      const folder = items.find(i => i.id === folderId);
      
      if (!folder || !folder.children) {
        return items;
      }
      
      // Process the children of this folder
      const updatedChildren = deleteItem(folder.children, path.slice(1));
      
      // Return the updated items array
      return items.map(i => 
        i.id === folderId 
          ? { ...i, children: updatedChildren } 
          : i
      );
    };
    
    const updatedFiles = deleteItem(items, fullPath);
    setFiles(updatedFiles);
    
    toast({
      title: `${item.type === 'folder' ? 'Folder' : 'File'} deleted`,
      description: `${item.name} has been removed`,
      duration: 2000,
    });
  };
  
  const startCreatingFile = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreatingFile(folderId);
    setNewItemName("");
  };
  
  const startCreatingFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreatingFolder(folderId);
    setNewItemName("");
  };
  
  const startRenaming = (item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(item.id);
    setRenameValue(item.name);
  };
  
  const handleCreateNewItem = (type: 'file' | 'folder', parentId: string) => {
    if (!newItemName.trim()) {
      toast({
        title: `Invalid name`,
        description: "Name cannot be empty",
        duration: 2000,
      });
      return;
    }
    
    const validNameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!validNameRegex.test(newItemName)) {
      toast({
        title: `Invalid name`,
        description: "Name can only contain letters, numbers, underscores, hyphens, and periods",
        duration: 2000,
      });
      return;
    }
    
    // For files, ensure they have an extension
    if (type === 'file' && !newItemName.includes('.')) {
      toast({
        title: `Invalid file name`,
        description: "File must have an extension (e.g., .js, .txt)",
        duration: 2000,
      });
      return;
    }
    
    // Get the full path to the parent folder
    const fullPath = [...parentPath];
    
    // Create the new item
    const newItem: FileSystemItem = {
      id: generateId(),
      name: newItemName,
      type: type,
    };
    
    // Add language based on extension for files
    if (type === 'file') {
      const ext = newItemName.split('.').pop()?.toLowerCase() || '';
      switch (ext) {
        case 'js':
          newItem.language = 'javascript';
          break;
        case 'jsx':
          newItem.language = 'jsx';
          break;
        case 'ts':
          newItem.language = 'typescript';
          break;
        case 'tsx':
          newItem.language = 'tsx';
          break;
        case 'css':
          newItem.language = 'css';
          break;
        case 'html':
          newItem.language = 'html';
          break;
        case 'py':
          newItem.language = 'python';
          break;
        case 'md':
          newItem.language = 'markdown';
          break;
        default:
          newItem.language = ext;
      }
    }
    
    // If it's a folder, add empty children array
    if (type === 'folder') {
      newItem.children = [];
    }
    
    // Add the new item to the file system
    const addItem = (items: FileSystemItem[], path: string[] = []): FileSystemItem[] => {
      if (path.length === 0) {
        // We're at the correct level, find the parent folder
        return items.map(item => {
          if (item.id === parentId) {
            // Add the new item to this folder's children
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          return item;
        });
      }
      
      // Find the folder we need to descend into
      const folderId = path[0];
      const folder = items.find(i => i.id === folderId);
      
      if (!folder || !folder.children) {
        return items;
      }
      
      // Process the children of this folder
      const updatedChildren = addItem(folder.children, path.slice(1));
      
      // Return the updated items array
      return items.map(i => 
        i.id === folderId 
          ? { ...i, children: updatedChildren } 
          : i
      );
    };
    
    const updatedFiles = addItem(items, fullPath);
    setFiles(updatedFiles);
    
    // Ensure the folder is expanded
    setExpandedFolders(prev => ({
      ...prev,
      [parentId]: true
    }));
    
    // Reset state
    setIsCreatingFile(null);
    setIsCreatingFolder(null);
    
    toast({
      title: `${type === 'folder' ? 'Folder' : 'File'} created`,
      description: `${newItemName} has been added`,
      duration: 2000,
    });
    
    // Auto-select the file if it's a file
    if (type === 'file') {
      onFileSelect(newItem);
    }
  };
  
  const handleRename = (item: FileSystemItem) => {
    if (!renameValue.trim()) {
      toast({
        title: `Invalid name`,
        description: "Name cannot be empty",
        duration: 2000,
      });
      return;
    }
    
    // Get the full path to the item
    const fullPath = [...parentPath];
    
    // Update the item name
    const updateItemName = (items: FileSystemItem[], path: string[] = []): FileSystemItem[] => {
      if (path.length === 0) {
        // We're at the correct level, rename the item
        return items.map(i => 
          i.id === item.id 
            ? { ...i, name: renameValue } 
            : i
        );
      }
      
      // Find the folder we need to descend into
      const folderId = path[0];
      const folder = items.find(i => i.id === folderId);
      
      if (!folder || !folder.children) {
        return items;
      }
      
      // Process the children of this folder
      const updatedChildren = updateItemName(folder.children, path.slice(1));
      
      // Return the updated items array
      return items.map(i => 
        i.id === folderId 
          ? { ...i, children: updatedChildren } 
          : i
      );
    };
    
    const updatedFiles = updateItemName(items, fullPath);
    setFiles(updatedFiles);
    
    // Reset state
    setIsRenaming(null);
    
    toast({
      title: `Renamed ${item.type}`,
      description: `${item.name} has been renamed to ${renameValue}`,
      duration: 2000,
    });
  };
  
  const cancelCreation = () => {
    setIsCreatingFile(null);
    setIsCreatingFolder(null);
    setNewItemName("");
  };
  
  const cancelRename = () => {
    setIsRenaming(null);
    setRenameValue("");
  };

  return (
    <div className="pl-3">
      {items.map((item) => (
        <div key={item.id} style={{ marginLeft: `${level * 12}px` }}>
          {item.type === "folder" ? (
            <div className="mb-1">
              <div 
                className="flex items-center py-1 px-2 rounded-md hover:bg-muted/40 cursor-pointer group"
                onClick={() => toggleFolder(item.id)}
              >
                <span className="mr-1.5">
                  {expandedFolders[item.id] ? 
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : 
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  }
                </span>
                <span className="mr-1.5">
                  {expandedFolders[item.id] ? 
                    <FolderOpen className="h-4 w-4 text-yellow-400" /> : 
                    <Folder className="h-4 w-4 text-yellow-400" />
                  }
                </span>
                
                {isRenaming === item.id ? (
                  <div className="flex items-center flex-1" onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      className="text-sm bg-muted/50 px-1 py-0.5 rounded flex-1"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(item);
                        if (e.key === 'Escape') cancelRename();
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1"
                      onClick={() => handleRename(item)}
                    >
                      <Check className="h-3 w-3 text-green-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={cancelRename}
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm flex-1">{item.name}</span>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-dark">
                    <DropdownMenuItem 
                      className="flex items-center cursor-pointer"
                      onClick={(e) => startCreatingFile(item.id, e as React.MouseEvent)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span>New File</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center cursor-pointer"
                      onClick={(e) => startCreatingFolder(item.id, e as React.MouseEvent)}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      <span>New Folder</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center cursor-pointer"
                      onClick={(e) => startRenaming(item, e as React.MouseEvent)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                      onClick={(e) => handleDelete(item, e as React.MouseEvent)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {expandedFolders[item.id] && (
                <>
                  {isCreatingFile === item.id && (
                    <div className="flex items-center ml-5 py-1 px-2">
                      <FileText className="h-4 w-4 text-gray-400 mr-1.5" />
                      <input 
                        type="text" 
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                        placeholder="filename.ext"
                        className="text-sm bg-muted/50 px-1 py-0.5 rounded flex-1"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleCreateNewItem('file', item.id);
                          if (e.key === 'Escape') cancelCreation();
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1"
                        onClick={() => handleCreateNewItem('file', item.id)}
                      >
                        <Check className="h-3 w-3 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={cancelCreation}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  )}
                  
                  {isCreatingFolder === item.id && (
                    <div className="flex items-center ml-5 py-1 px-2">
                      <Folder className="h-4 w-4 text-yellow-400 mr-1.5" />
                      <input 
                        type="text" 
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                        placeholder="folder name"
                        className="text-sm bg-muted/50 px-1 py-0.5 rounded flex-1"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleCreateNewItem('folder', item.id);
                          if (e.key === 'Escape') cancelCreation();
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1"
                        onClick={() => handleCreateNewItem('folder', item.id)}
                      >
                        <Check className="h-3 w-3 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={cancelCreation}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  )}
                  
                  {item.children && (
                    <FileExplorer 
                      items={item.children} 
                      level={level + 1} 
                      onFileSelect={onFileSelect} 
                      setFiles={setFiles}
                      parentPath={[...parentPath, item.id]}
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <div 
              className="flex items-center py-1 px-2 rounded-md hover:bg-muted/40 cursor-pointer group ml-5"
              onClick={() => onFileSelect(item)}
            >
              <span className="mr-1.5">
                {getIconForFile(item)}
              </span>
              
              {isRenaming === item.id ? (
                <div className="flex items-center flex-1" onClick={e => e.stopPropagation()}>
                  <input 
                    type="text" 
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    className="text-sm bg-muted/50 px-1 py-0.5 rounded flex-1"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRename(item);
                      if (e.key === 'Escape') cancelRename();
                    }}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1"
                    onClick={() => handleRename(item)}
                  >
                    <Check className="h-3 w-3 text-green-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5"
                    onClick={cancelRename}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ) : (
                <span className="text-sm flex-1">{item.name}</span>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-dark">
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer"
                    onClick={(e) => startRenaming(item, e as React.MouseEvent)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                    onClick={(e) => handleDelete(item, e as React.MouseEvent)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onFileSelect }) => {
  const [files, setFiles] = useState<FileSystemItem[]>(initialFiles);
  const { toast } = useToast();
  
  const handleCreateNew = () => {
    // Simulate creating a new file in the root
    const newFile: FileSystemItem = {
      id: generateId(),
      name: "new-file.js",
      type: "file",
      language: "javascript"
    };
    
    setFiles(prev => [...prev, newFile]);
    onFileSelect(newFile);
    
    toast({
      title: "New file created",
      description: "new-file.js has been added to the root",
      duration: 2000,
    });
  };

  return (
    <div className="h-full flex flex-col bg-sidebar w-64 border-r border-border animate-slide-in-left">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="font-medium text-sm">EXPLORER</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCreateNew}
          className="h-7 w-7 rounded-full hover:bg-muted/40"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <FileExplorer 
          items={files} 
          onFileSelect={onFileSelect} 
          setFiles={setFiles} 
        />
      </div>
      
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground animate-typing typing-cursor w-56 overflow-hidden">
          🚀 Launch your logic into the stars.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
