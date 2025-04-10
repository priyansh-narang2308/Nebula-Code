
import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Settings, 
  FileCode, 
  Terminal,
  Play,
  Save,
  Moon,
  Sun,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

interface Command {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: string;
  shortcut?: string;
}

const commands: Command[] = [
  {
    id: "1",
    title: "Open Settings",
    icon: <Settings className="h-4 w-4" />,
    action: "settings",
    shortcut: "Ctrl+,"
  },
  {
    id: "2",
    title: "New File",
    icon: <FileCode className="h-4 w-4" />,
    action: "new-file",
    shortcut: "Ctrl+N"
  },
  {
    id: "3",
    title: "Save File",
    icon: <Save className="h-4 w-4" />,
    action: "save",
    shortcut: "Ctrl+S"
  },
  {
    id: "4",
    title: "Toggle Terminal",
    icon: <Terminal className="h-4 w-4" />,
    action: "terminal",
    shortcut: "Ctrl+`"
  },
  {
    id: "5",
    title: "Run Code",
    icon: <Play className="h-4 w-4" />,
    action: "run",
    shortcut: "F5"
  },
  {
    id: "6",
    title: "Toggle Dark Mode",
    icon: <Moon className="h-4 w-4" />,
    action: "dark-mode",
    shortcut: "Ctrl+Shift+D"
  },
  {
    id: "7",
    title: "Toggle Light Mode",
    icon: <Sun className="h-4 w-4" />,
    action: "light-mode",
    shortcut: "Ctrl+Shift+L"
  }
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onCommand }) => {
  const [search, setSearch] = useState("");
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(commands);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (search) {
      const filtered = commands.filter(
        command => command.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCommands(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredCommands(commands);
    }
  }, [search]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && filteredCommands.length > 0) {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      onCommand(selected.action);
      onClose();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };
  
  const handleCommandClick = (action: string) => {
    onCommand(action);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] animate-fade-in">
      <div className="w-full max-w-xl glass animate-scale-in rounded-lg shadow-lg overflow-hidden border border-border">
        {/* Search input */}
        <div className="flex items-center p-3 border-b border-border bg-muted/30">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="glass-input bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-2 h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Command list */}
        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`flex items-center justify-between p-3 hover:bg-muted/20 cursor-pointer ${
                  index === selectedIndex ? 'bg-muted/30' : ''
                }`}
                onClick={() => handleCommandClick(command.action)}
              >
                <div className="flex items-center">
                  <div className="mr-3 text-nebula">{command.icon}</div>
                  <div>{command.title}</div>
                </div>
                {command.shortcut && (
                  <div className="text-xs text-muted-foreground">
                    {command.shortcut}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
