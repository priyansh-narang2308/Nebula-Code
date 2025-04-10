
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState("javascript");
  const [autoSave, setAutoSave] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-xl glass rounded-lg shadow-lg p-6 animate-scale-in max-h-[80vh] overflow-y-auto border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-muted-foreground">Appearance</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <ThemeToggle />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                </div>
                <Slider
                  id="font-size"
                  min={10}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Editor Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-muted-foreground">Editor</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Default Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px] glass-input">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="glass-dark">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <div className="text-xs text-muted-foreground">Automatically save files when changed</div>
                </div>
                <Switch 
                  id="auto-save" 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="word-wrap">Word Wrap</Label>
                  <div className="text-xs text-muted-foreground">Wrap text to prevent horizontal scrolling</div>
                </div>
                <Switch 
                  id="word-wrap" 
                  checked={wordWrap} 
                  onCheckedChange={setWordWrap} 
                />
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-nebula to-nebula-accent flex items-center justify-center">
                <span className="text-white font-mono text-xs">&lt;/&gt;</span>
              </div>
              <div>
                <div className="font-bold">NebulaCode Studio</div>
                <div className="text-xs text-muted-foreground">Version 1.0.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
