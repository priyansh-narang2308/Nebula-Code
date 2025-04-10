
import React, { useState, useEffect, useRef } from "react";
import { X, Copy, XCircle, ArrowUp, Terminal as TerminalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  executionOutput?: string;
}

interface LogEntry {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'command';
  content: string;
  timestamp: Date;
}

const getLogClassName = (type: LogEntry['type']) => {
  switch(type) {
    case 'info':
      return 'text-blue-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
    case 'success':
      return 'text-green-400';
    case 'command':
      return 'text-purple-400';
    default:
      return 'text-foreground';
  }
};

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose, executionOutput }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [height, setHeight] = useState<number>(264); // Default height (64px * 4 + 8px)
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = window.innerHeight * 0.8;
  
  // Generate initial logs on mount
  useEffect(() => {
    if (isOpen) {
      const initialLogs: LogEntry[] = [
        {
          id: '1',
          type: 'info',
          content: 'NebulaCode Studio Terminal v1.0.0',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'info',
          content: 'Type "help" for available commands',
          timestamp: new Date()
        }
      ];
      
      setLogs(initialLogs);
      
      // Focus the input when terminal opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);
  
  // Add execution output when it changes
  useEffect(() => {
    if (executionOutput) {
      setLogs(prev => [
        ...prev,
        {
          id: `exec-${Date.now()}`,
          type: 'info',
          content: 'Executing code...',
          timestamp: new Date()
        },
        {
          id: `output-${Date.now()}`,
          type: 'success',
          content: executionOutput,
          timestamp: new Date()
        }
      ]);
    }
  }, [executionOutput]);
  
  // Scroll to bottom when new log is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);
  
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user command to logs
    setLogs(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        type: 'command',
        content: `$ ${inputValue}`,
        timestamp: new Date()
      }
    ]);
    
    // Add to command history
    setCommandHistory(prev => [inputValue, ...prev.slice(0, 49)]); // Keep last 50 commands
    setHistoryIndex(-1);
    
    // Process command
    processCommand(inputValue);
    
    setInputValue("");
  };
  
  const processCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    // Simple command processor
    if (cmd === 'clear' || cmd === 'cls') {
      setLogs([{
        id: `clear-${Date.now()}`,
        type: 'info',
        content: 'Terminal cleared',
        timestamp: new Date()
      }]);
    } else if (cmd === 'help') {
      setLogs(prev => [
        ...prev,
        {
          id: `help-${Date.now()}`,
          type: 'info',
          content: 'Available commands:\n- clear/cls: Clear the terminal\n- help: Show this help message\n- version: Show terminal version\n- echo [text]: Print text\n- time: Show current time',
          timestamp: new Date()
        }
      ]);
    } else if (cmd === 'version') {
      setLogs(prev => [
        ...prev,
        {
          id: `version-${Date.now()}`,
          type: 'info',
          content: 'NebulaCode Studio Terminal v1.0.0',
          timestamp: new Date()
        }
      ]);
    } else if (cmd === 'time') {
      setLogs(prev => [
        ...prev,
        {
          id: `time-${Date.now()}`,
          type: 'info',
          content: `Current time: ${new Date().toLocaleString()}`,
          timestamp: new Date()
        }
      ]);
    } else if (cmd.startsWith('echo ')) {
      const text = command.substring(5);
      setLogs(prev => [
        ...prev,
        {
          id: `echo-${Date.now()}`,
          type: 'info',
          content: text,
          timestamp: new Date()
        }
      ]);
    } else {
      setLogs(prev => [
        ...prev,
        {
          id: `unknown-${Date.now()}`,
          type: 'error',
          content: `Command not found: ${command}`,
          timestamp: new Date()
        }
      ]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };
  
  const copyToClipboard = () => {
    const terminalText = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(terminalText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Terminal output copied to clipboard",
        duration: 2000,
      });
    });
  };
  
  const clearTerminal = () => {
    setLogs([{
      id: `clear-${Date.now()}`,
      type: 'info',
      content: 'Terminal cleared',
      timestamp: new Date()
    }]);
  };
  
  // Terminal resize logic
  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const startY = e.clientY;
    const startHeight = height;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + deltaY));
      setHeight(newHeight);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 bg-background border-t border-border animate-slide-in-bottom"
      style={{ height: `${height}px` }}
    >
      {/* Resize handle */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-transparent cursor-ns-resize z-10 flex items-center justify-center"
        onMouseDown={startResize}
      >
        <div className="w-20 h-1 bg-border/50 rounded-full hover:bg-primary/50 transition-colors" />
      </div>
      
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <div className="flex items-center">
          <TerminalIcon className="h-4 w-4 mr-2 text-primary" />
          <div className="text-sm font-medium">Terminal</div>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyToClipboard} 
            className="h-6 w-6" 
            title="Copy terminal output"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearTerminal} 
            className="h-6 w-6" 
            title="Clear terminal"
          >
            <XCircle className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6" title="Close terminal">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-[calc(100%-72px)] p-3 font-mono text-sm overflow-auto bg-sidebar"
      >
        {logs.map(log => (
          <div key={log.id} className="mb-1">
            <span className="text-gray-500 mr-2">
              {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={getLogClassName(log.type)}>
              {log.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>
      
      {/* Terminal input */}
      <form onSubmit={handleInputSubmit} className="flex items-center px-3 py-2 border-t border-border">
        <span className="text-primary mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent flex-1 outline-none font-mono text-sm"
          placeholder="Type a command..."
          autoComplete="off"
          spellCheck="false"
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-muted-foreground hover:text-primary"
          title="Run command"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
};

export default Terminal;
