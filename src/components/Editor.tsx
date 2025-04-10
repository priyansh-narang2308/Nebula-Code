
import React, { useState, useRef, useEffect } from "react";
import { X, Play, Save, Copy, Download, Upload, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { codeSnippets } from "@/lib/codeSnippets";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface Tab {
  id: string;
  title: string;
  language: string;
  content: string;
}

interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: FileSystemItem[];
}

interface EditorProps {
  selectedFile: FileSystemItem | null;
  onRunCode: (code: string, language: string) => void;
}

// Map file extensions to Prism language
const getPrismLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'css': 'css',
    'html': 'html',
    'py': 'python',
    'python': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'rust': 'rust',
    'go': 'go',
    'md': 'markdown',
    'markdown': 'markdown',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'sh': 'bash',
    'bash': 'bash',
    'sql': 'sql',
    'php': 'php',
    'rb': 'ruby',
    'ruby': 'ruby',
  };
  
  return languageMap[language.toLowerCase()] || 'plaintext';
};

const Editor: React.FC<EditorProps> = ({ selectedFile, onRunCode }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "welcome",
      title: "welcome.md",
      language: "markdown",
      content: "# Welcome to NebulaCode Studio\n\nSelect a file from the explorer to start editing, or create a new file.\n\n## Features\n\n- Multi-language syntax highlighting\n- File explorer\n- Terminal\n- Settings panel\n- Command palette\n- Code editing and execution\n\n*Launch your logic into the stars* ✨"
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("welcome");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const { toast } = useToast();
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [editorFocused, setEditorFocused] = useState(false);

  // Handle file selection from sidebar
  useEffect(() => {
    if (selectedFile && selectedFile.type === "file") {
      // Check if the file is already open in a tab
      const existingTab = tabs.find(tab => tab.title === selectedFile.name);
      
      if (existingTab) {
        // If the tab already exists, just make it active
        setActiveTabId(existingTab.id);
      } else {
        // Create a new tab for this file
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        const language = selectedFile.language || fileExtension;
        
        // Get content for the file (in a real app, this would come from filesystem)
        let content = "// Empty file";
        
        // Check if we have a sample for this file
        if (codeSnippets[selectedFile.name]) {
          content = codeSnippets[selectedFile.name];
        }
        
        const newTab: Tab = {
          id: selectedFile.id,
          title: selectedFile.name,
          language: language,
          content: content
        };
        
        // Add the new tab and make it active
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(selectedFile.id);
      }
    }
  }, [selectedFile]);

  // Apply syntax highlighting
  useEffect(() => {
    const activeTab = getActiveTab();
    if (highlightRef.current) {
      highlightRef.current.textContent = activeTab.content;
      const language = getPrismLanguage(activeTab.language);
      highlightRef.current.className = `language-${language} line-numbers`;
      Prism.highlightElement(highlightRef.current);
    }
  }, [tabs, activeTabId]);

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't allow closing the last tab
    if (tabs.length <= 1) {
      toast({
        title: "Cannot close tab",
        description: "At least one tab must remain open",
        duration: 2000,
      });
      return;
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== id));
    
    // If we're closing the active tab, activate another one
    if (activeTabId === id) {
      const remainingTabs = tabs.filter(tab => tab.id !== id);
      setActiveTabId(remainingTabs[0].id);
    }
  };

  // Handle code content change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = e.target.value;
    
    // Update the content of the active tab
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: updatedContent } 
        : tab
    ));
    
    // Update cursor position
    updateCursorPosition();
  };

  // Update cursor position
  const updateCursorPosition = () => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const content = textarea.value.substring(0, textarea.selectionStart);
    const lines = content.split('\n');
    const lineCount = lines.length;
    const columnCount = lines[lines.length - 1].length + 1;
    
    setCursorPosition({
      line: lineCount,
      column: columnCount
    });
  };

  // Handle textarea key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key to insert spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = editorRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = textarea.value;
      
      // Insert 2 spaces at cursor position
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      
      // Update the content
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, content: newContent } 
          : tab
      ));
      
      // Update cursor position after React updates the DOM
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateCursorPosition();
        }
      }, 0);
    }
    
    // Update cursor position
    requestAnimationFrame(updateCursorPosition);
  };

  // Save the current file
  const handleSave = () => {
    // In a real app, this would save to a server or local filesystem
    toast({
      title: "File saved",
      description: `${getActiveTab().title} has been saved`,
      duration: 2000,
    });
  };

  // Run the current code
  const handleRun = () => {
    const activeTab = getActiveTab();
    onRunCode(activeTab.content, activeTab.language);
    toast({
      title: "Running code",
      description: `Executing ${activeTab.title}`,
      duration: 2000,
    });
  };

  // Copy code to clipboard
  const handleCopy = () => {
    const activeTab = getActiveTab();
    navigator.clipboard.writeText(activeTab.content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `Code from ${activeTab.title} copied to clipboard`,
        duration: 2000,
      });
    });
  };

  // Download the current file
  const handleDownload = () => {
    const activeTab = getActiveTab();
    const blob = new Blob([activeTab.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: `${activeTab.title} has been downloaded`,
      duration: 2000,
    });
  };

  // Format code (simple indentation)
  const handleFormat = () => {
    const activeTab = getActiveTab();
    let formatted = activeTab.content;
    
    // Very basic formatting - in a real app, you'd use a proper formatter like Prettier
    // This is just a simple simulation
    formatted = formatted.replace(/{\s*\n/g, '{\n  ');
    formatted = formatted.replace(/}\n/g, '}\n\n');
    
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: formatted } 
        : tab
    ));
    
    toast({
      title: "Code formatted",
      description: `${activeTab.title} has been formatted`,
      duration: 2000,
    });
  };

  // Find the active tab
  const getActiveTab = (): Tab => {
    return tabs.find(tab => tab.id === activeTabId) || tabs[0];
  };

  const activeTab = getActiveTab();

  // Sync scroll between textarea and highlighted code
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Update editor focus when tab changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [activeTabId]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tabs */}
      <div className="flex justify-between bg-background border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 border-r border-border cursor-pointer group transition-all duration-200 ${
                tab.id === activeTabId
                  ? "bg-muted text-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted/30"
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="truncate max-w-[120px]">{tab.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="ml-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center mr-2 space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 rounded-full glass glow-on-hover"
            title="Copy Code"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8 rounded-full glass glow-on-hover"
            title="Download File"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFormat}
            className="h-8 w-8 rounded-full glass glow-on-hover"
            title="Format Code"
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="h-8 w-8 rounded-full glass glow-on-hover"
            title="Save File"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRun}
            className="h-8 w-8 rounded-full glass glow-on-hover text-accent"
            title="Run Code"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="h-full flex flex-col relative overflow-hidden">
        <div className="relative h-full w-full overflow-hidden">
          {/* Syntax highlighted code (visual layer) */}
          <pre 
            ref={highlightRef}
            className={`absolute top-0 left-0 right-0 bottom-0 m-0 p-4 font-mono text-sm overflow-auto bg-background text-foreground`}
            style={{ 
              pointerEvents: 'none',
              tabSize: 2
            }}
          ></pre>
          
          {/* Actual textarea (functional layer) */}
          <textarea
            ref={editorRef}
            value={activeTab.content}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            onFocus={() => setEditorFocused(true)}
            onBlur={() => setEditorFocused(false)}
            className={`absolute top-0 left-0 right-0 bottom-0 p-4 font-mono text-sm bg-transparent text-transparent caret-white outline-none resize-none`}
            spellCheck={false}
            style={{ 
              caretColor: 'white',
              tabSize: 2
            }}
          />
        </div>
        
        <div className={`absolute bottom-2 right-4 text-xs ${editorFocused ? 'text-primary' : 'text-muted-foreground'} bg-background/70 px-2 py-1 rounded backdrop-blur-sm`}>
          {activeTab.language.toUpperCase()} | Line: {cursorPosition.line}, Col: {cursorPosition.column}
        </div>
      </div>
    </div>
  );
};

export default Editor;
