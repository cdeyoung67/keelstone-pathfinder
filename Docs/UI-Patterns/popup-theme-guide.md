# Pathfinder Popup Theme Guide

## Overview
This document defines the unified popup theme system for the Pathfinder application, ensuring consistent, professional, and brand-aligned popups throughout the app.

## Color System

### Primary Colors
- **Gold Borders**: 
  - Thick: `border-2 border-gold-500` (main containers)
  - Thin: `border border-gold-400` (inner elements, buttons, dividers)
- **Background**: 
  - Main: `bg-gradient-to-b from-[#E8E5DC] to-[#F1F0EA]` (elegant gradient)
  - Inner sections: `bg-popup` (beige/cream)
- **Text Colors**:
  - Titles: `text-navy-900` (Keelstone dark blue)
  - Subtitles: `text-gray-500` (medium grey)
  - Labels: `text-navy-900` (Keelstone blue)
  - Filled inputs: `text-gray-700` (subtle dark grey)
  - Placeholders: `text-slate-500` (light blue/grey, matches sign-in)

## Component Patterns

### Main Popup Container
```jsx
<Card className="max-w-3xl w-full max-h-[92vh] md:max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl drop-shadow-lg bg-gradient-to-b from-[#E8E5DC] to-[#F1F0EA] text-popup-foreground border-2 border-gold-500">
```

### Header Section
```jsx
<CardHeader className="border-b border-gold-400 rounded-t-xl">
  <CardTitle className="text-xl font-serif text-navy-900">Title Here</CardTitle>
  <CardDescription className="text-gray-500">Subtitle here</CardDescription>
</CardHeader>
```

### Inner Content Box
```jsx
<div className="space-y-4 bg-popup rounded-lg p-6 m-4 border border-gold-400 shadow-md">
  <h3 className="text-lg font-serif font-semibold text-navy-900">Section Title</h3>
  <p className="text-sm text-gray-500">Section description</p>
</div>
```

### Form Inputs
```jsx
<Label className="text-sm font-medium text-navy-900">Field Label</Label>
<Input className="bg-gray-50 border-gray-200 shadow-sm focus:border-selected focus:ring-2 focus:ring-selected/20 placeholder:text-slate-500 text-gray-700" />
```

### Navigation Buttons
```jsx
// Back button
<Button className="text-gray-600 hover:text-gray-900 hover:bg-muted/50 border border-gold-400 shadow-md hover:shadow-lg transition-all duration-200">
  Back
</Button>

// Primary action button
<Button className="bg-gradient-to-r from-selected to-accent hover:from-selected/90 hover:to-accent/90 text-selected-foreground border border-gold-400 shadow-md hover:shadow-lg transition-all duration-200">
  Next
</Button>
```

### Footer Section
```jsx
<CardContent className="border-t border-gold-400 rounded-b-xl pt-6">
  <div className="flex justify-between items-center">
    {/* Navigation buttons here */}
  </div>
</CardContent>
```

## Shadow System
- **Main container**: `shadow-2xl drop-shadow-lg` (heavy emphasis)
- **Inner elements**: `shadow-md` (medium depth)
- **Buttons**: `shadow-md hover:shadow-lg` (interactive feedback)
- **Dividers**: No shadow (clean separation)

## Spacing Guidelines
- **Container padding**: `p-6` for inner sections
- **Container margin**: `m-4` for inner sections
- **Footer spacing**: `pt-6` to separate from divider
- **Element spacing**: `space-y-4` for vertical layouts

## Typography Hierarchy
1. **Main titles**: `text-xl font-serif text-navy-900` (most important)
2. **Section titles**: `text-lg font-serif font-semibold text-navy-900`
3. **Labels**: `text-sm font-medium text-navy-900`
4. **Body text**: `text-sm text-gray-500`
5. **Helper text**: `text-xs text-gray-500`

## Interactive States
- **Focus rings**: `focus:ring-2 focus:ring-selected/20` (gold)
- **Focus borders**: `focus:border-selected` (gold)
- **Hover effects**: Enhanced shadows and subtle color shifts
- **Transitions**: `transition-all duration-200` for smooth interactions

## Accessibility
- High contrast text colors on backgrounds
- Proper focus indicators with gold rings
- Semantic HTML structure
- Screen reader friendly labels

## Usage Examples

### Basic Popup
```jsx
<Dialog>
  <DialogContent className="max-w-lg bg-gradient-to-b from-[#E8E5DC] to-[#F1F0EA] border-2 border-gold-500 shadow-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl font-serif text-navy-900">Popup Title</DialogTitle>
      <DialogDescription className="text-gray-500">Description text</DialogDescription>
    </DialogHeader>
    
    <div className="bg-popup rounded-lg p-6 border border-gold-400 shadow-md">
      {/* Content here */}
    </div>
    
    <DialogFooter className="border-t border-gold-400 pt-6">
      {/* Buttons here */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form Popup
Use the IntakeForm component as the reference implementation for complex form popups with multiple steps and validation.

## Implementation Notes
- All popups should use this theme for consistency
- The theme is built on the unified popup CSS variables in `globals.css`
- Colors automatically adapt for dark mode when implemented
- Always test color contrast for accessibility compliance

## Brand Alignment
This theme reflects the Keelstone brand identity:
- **Premium feel**: Gold accents and elegant gradients
- **Professional appearance**: Subtle shadows and clean typography
- **Brand colors**: Keelstone navy blue for important elements
- **Consistent experience**: Matches sign-in popup and overall app design
