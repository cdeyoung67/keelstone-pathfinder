/**
 * Pathfinder Popup Theme Template
 * 
 * This template demonstrates the standard popup theme pattern.
 * Copy and modify this structure for consistent popup styling across the app.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

interface PopupTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PopupTemplate({ isOpen, onClose, title, description, children }: PopupTemplateProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-b from-[#E8E5DC] to-[#F1F0EA] border-2 border-gold-500 shadow-2xl drop-shadow-lg">
        
        {/* Header */}
        <DialogHeader className="border-b border-gold-400 rounded-t-xl pb-4">
          <DialogTitle className="text-xl font-serif text-navy-900">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-500">{description}</DialogDescription>
          )}
        </DialogHeader>
        
        {/* Content */}
        <div className="bg-popup rounded-lg p-6 m-4 border border-gold-400 shadow-md">
          {children}
        </div>
        
        {/* Footer */}
        <DialogFooter className="border-t border-gold-400 pt-6">
          <div className="flex justify-between items-center w-full">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 hover:bg-muted/50 border border-gold-400 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-selected to-accent hover:from-selected/90 hover:to-accent/90 text-selected-foreground border border-gold-400 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
        
      </DialogContent>
    </Dialog>
  );
}

/**
 * Example form section component following the theme
 */
export function PopupFormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-semibold text-navy-900">{title}</h3>
      {children}
    </div>
  );
}

/**
 * Example form field component following the theme
 */
export function PopupFormField({ 
  label, 
  placeholder, 
  value, 
  onChange,
  type = "text" 
}: { 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-navy-900">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border-gray-200 shadow-sm focus:border-selected focus:ring-2 focus:ring-selected/20 placeholder:text-slate-500 text-gray-700"
      />
    </div>
  );
}

/**
 * Usage Example:
 * 
 * <PopupTemplate
 *   isOpen={showPopup}
 *   onClose={() => setShowPopup(false)}
 *   title="Example Popup"
 *   description="This demonstrates the popup theme"
 * >
 *   <PopupFormSection title="User Information">
 *     <PopupFormField
 *       label="Name"
 *       placeholder="Enter your name"
 *       value={name}
 *       onChange={setName}
 *     />
 *   </PopupFormSection>
 * </PopupTemplate>
 */
