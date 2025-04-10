
import React from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Settings, Save, Terminal, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  onToggleTerminal: () => void;
  onToggleSettings: () => void;
  onToggleCommandPalette: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onToggleTerminal, 
  onToggleSettings,
  onToggleCommandPalette
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Project saved",
      description: "Your changes have been saved successfully",
      duration: 2000,
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-border h-14">
      <div className="flex items-center">
        <div className="flex items-center mr-6">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-nebula to-nebula-accent flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-mono text-xs">&lt;/&gt;</span>
          </div>
          <span className="ml-2 font-bold text-lg tracking-tight">NebulaCode</span>
          <span className="ml-1 text-xs bg-nebula/20 px-1.5 py-0.5 rounded text-nebula">STUDIO</span>
        </div>
        
        <div className="hidden md:flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSave}
            className="flex items-center glow-on-hover"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCommandPalette}
          className="rounded-full glass glow-on-hover"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleTerminal}
          className="rounded-full glass glow-on-hover"
        >
          <Terminal className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSettings}
          className="rounded-full glass glow-on-hover"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
