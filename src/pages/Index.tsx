
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import Terminal from "@/components/Terminal";
import CommandPalette from "@/components/CommandPalette";
import SettingsPanel from "@/components/SettingsPanel";
import Starfield from "@/components/Starfield";
import { useToast } from "@/hooks/use-toast";

interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: FileSystemItem[];
}

const Index = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);
  const [executionOutput, setExecutionOutput] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = (file: FileSystemItem) => {
    if (file.type === "file") {
      setSelectedFile(file);
    }
  };

  const handleToggleTerminal = () => {
    setIsTerminalOpen(prev => !prev);
  };

  const handleToggleCommandPalette = () => {
    setIsCommandPaletteOpen(prev => !prev);
  };

  const handleToggleSettings = () => {
    setIsSettingsPanelOpen(prev => !prev);
  };

  const handleRunCode = (code: string, language: string) => {
    setIsTerminalOpen(true);
    
    // In a real app, this would send the code to a real execution environment
    // For now, we'll simulate execution with a simple console.log equivalent
    
    // Simple JavaScript execution
    if (language === 'javascript' || language === 'js') {
      try {
        // Very basic simulation - in a real app, you'd use a sandbox
        // THIS IS NOT SECURE - just for demonstration purposes
        const consoleOutput: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => {
            consoleOutput.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
          },
          error: (...args: any[]) => {
            consoleOutput.push(`ERROR: ${args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ')}`);
          }
        };
        
        // Replace console.log with our mock
        const safeCode = code
          .replace(/console\.log/g, 'mockConsole.log')
          .replace(/console\.error/g, 'mockConsole.error');
        
        // Execute the code in a way that allows access to our mockConsole
        const executeCode = new Function('mockConsole', safeCode);
        executeCode(mockConsole);
        
        setExecutionOutput(consoleOutput.join('\n') || 'Code executed successfully (no output)');
      } catch (error) {
        setExecutionOutput(`Error executing code: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else if (language === 'html') {
      setExecutionOutput("HTML preview would render here in a real implementation");
    } else {
      setExecutionOutput(`Running ${language} code is currently simulated.\nCode received (${code.length} characters)`);
    }
  };

  const handleCommand = (command: string) => {
    switch (command) {
      case "settings":
        setIsSettingsPanelOpen(true);
        break;
      case "terminal":
        setIsTerminalOpen(prev => !prev);
        break;
      case "save":
        toast({
          title: "File saved",
          description: "Your changes have been saved successfully",
          duration: 2000,
        });
        break;
      case "run":
        toast({
          title: "Running code",
          description: "Use the run button in the editor to execute code",
          duration: 2000,
        });
        break;
      case "new-file":
        toast({
          title: "New file",
          description: "Use the + button in the sidebar to create a new file",
          duration: 2000,
        });
        break;
      case "dark-mode":
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        toast({
          title: "Dark theme activated",
          description: "Your visual preferences have been updated",
          duration: 2000,
        });
        break;
      case "light-mode":
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        toast({
          title: "Light theme activated",
          description: "Your visual preferences have been updated",
          duration: 2000,
        });
        break;
      default:
        toast({
          title: "Command executed",
          description: `Command: ${command}`,
          duration: 2000,
        });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar 
        onToggleTerminal={handleToggleTerminal}
        onToggleSettings={handleToggleSettings}
        onToggleCommandPalette={handleToggleCommandPalette}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onFileSelect={handleFileSelect} />
        
        <div className="flex-1 relative">
          <Editor 
            selectedFile={selectedFile} 
            onRunCode={handleRunCode}
          />
          
          {isTerminalOpen && (
            <Terminal 
              isOpen={isTerminalOpen} 
              onClose={handleToggleTerminal}
              executionOutput={executionOutput}
            />
          )}
        </div>
      </div>

      {isCommandPaletteOpen && (
        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={handleToggleCommandPalette}
          onCommand={handleCommand}
        />
      )}
      
      {isSettingsPanelOpen && (
        <SettingsPanel 
          isOpen={isSettingsPanelOpen} 
          onClose={handleToggleSettings}
        />
      )}
      
      <Starfield />
    </div>
  );
};

export default Index;
