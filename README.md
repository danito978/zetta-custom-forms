# React Application

A clean, modern React application with TypeScript and Tailwind CSS.

## 🎨 Color System

This project uses a standardized color palette to ensure consistency across all components and pages. All colors are defined in `tailwind.config.js` and can be used with Tailwind CSS classes.

### Primary Colors (Blue)
**Usage:** Main brand elements, primary buttons, links, and key UI elements
- `primary-50` - #eff6ff (Lightest blue for backgrounds)
- `primary-100` - #dbeafe (Very light blue for subtle backgrounds)
- `primary-200` - #bfdbfe (Light blue for hover states)
- `primary-300` - #93c5fd (Medium light blue)
- `primary-400` - #60a5fa (Medium blue)
- **`primary-500` - #3b82f6 (Main primary color)** ⭐
- `primary-600` - #2563eb (Darker blue for hover states)
- `primary-700` - #1d4ed8 (Dark blue)
- `primary-800` - #1e40af (Very dark blue)
- `primary-900` - #1e3a8a (Darkest blue)
- `primary-950` - #172554 (Ultra dark blue)

### Secondary Colors (Sky Blue)
**Usage:** Secondary buttons, accents, highlights, and complementary elements
- `secondary-50` - #f0f9ff (Lightest sky blue)
- `secondary-100` - #e0f2fe (Very light sky blue)
- `secondary-200` - #bae6fd (Light sky blue)
- `secondary-300` - #7dd3fc (Medium light sky blue)
- `secondary-400` - #38bdf8 (Medium sky blue)
- **`secondary-500` - #0ea5e9 (Main secondary color)** ⭐
- `secondary-600` - #0284c7 (Darker sky blue)
- `secondary-700` - #0369a1 (Dark sky blue)
- `secondary-800` - #075985 (Very dark sky blue)
- `secondary-900` - #0c4a6e (Darkest sky blue)
- `secondary-950` - #082f49 (Ultra dark sky blue)

### Success Colors (Green)
**Usage:** Success messages, confirmations, positive states
- `success-50` - #f0fdf4 (Lightest green)
- `success-100` - #dcfce7 (Very light green)
- `success-200` - #bbf7d0 (Light green)
- `success-300` - #86efac (Medium light green)
- `success-400` - #4ade80 (Medium green)
- **`success-500` - #22c55e (Main success color)** ⭐
- `success-600` - #16a34a (Darker green)
- `success-700` - #15803d (Dark green)
- `success-800` - #166534 (Very dark green)
- `success-900` - #14532d (Darkest green)
- `success-950` - #052e16 (Ultra dark green)

### Warning Colors (Amber)
**Usage:** Warning messages, caution states, pending actions
- `warning-50` - #fffbeb (Lightest amber)
- `warning-100` - #fef3c7 (Very light amber)
- `warning-200` - #fde68a (Light amber)
- `warning-300` - #fcd34d (Medium light amber)
- `warning-400` - #fbbf24 (Medium amber)
- **`warning-500` - #f59e0b (Main warning color)** ⭐
- `warning-600` - #d97706 (Darker amber)
- `warning-700` - #b45309 (Dark amber)
- `warning-800` - #92400e (Very dark amber)
- `warning-900` - #78350f (Darkest amber)
- `warning-950` - #451a03 (Ultra dark amber)

### Error Colors (Red)
**Usage:** Error messages, destructive actions, validation errors
- `error-50` - #fef2f2 (Lightest red)
- `error-100` - #fee2e2 (Very light red)
- `error-200` - #fecaca (Light red)
- `error-300` - #fca5a5 (Medium light red)
- `error-400` - #f87171 (Medium red)
- **`error-500` - #ef4444 (Main error color)** ⭐
- `error-600` - #dc2626 (Darker red)
- `error-700` - #b91c1c (Dark red)
- `error-800` - #991b1b (Very dark red)
- `error-900` - #7f1d1d (Darkest red)
- `error-950` - #450a0a (Ultra dark red)

### Neutral Colors (Gray)
**Usage:** Text, borders, backgrounds, and general UI elements
- `neutral-50` - #fafafa (Lightest gray - page backgrounds)
- `neutral-100` - #f5f5f5 (Very light gray - card backgrounds)
- `neutral-200` - #e5e5e5 (Light gray - borders)
- `neutral-300` - #d4d4d4 (Medium light gray - disabled states)
- `neutral-400` - #a3a3a3 (Medium gray - placeholders)
- **`neutral-500` - #737373 (Main neutral color - secondary text)** ⭐
- `neutral-600` - #525252 (Darker gray - primary text)
- `neutral-700` - #404040 (Dark gray - headings)
- `neutral-800` - #262626 (Very dark gray - important text)
- `neutral-900` - #171717 (Darkest gray - high contrast text)
- `neutral-950` - #0a0a0a (Ultra dark gray - maximum contrast)

## 🚀 Usage Examples

### Buttons
```jsx
// Primary button
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Action
</button>

// Secondary button
<button className="bg-secondary-500 hover:bg-secondary-600 text-white">
  Secondary Action
</button>

// Success button
<button className="bg-success-500 hover:bg-success-600 text-white">
  Confirm
</button>

// Warning button
<button className="bg-warning-500 hover:bg-warning-600 text-white">
  Warning
</button>

// Error/Destructive button
<button className="bg-error-500 hover:bg-error-600 text-white">
  Delete
</button>
```

### Text Colors
```jsx
// Primary text
<h1 className="text-neutral-900">Main Heading</h1>
<p className="text-neutral-600">Body text</p>
<span className="text-neutral-400">Secondary text</span>

// Semantic text colors
<p className="text-success-600">Success message</p>
<p className="text-warning-600">Warning message</p>
<p className="text-error-600">Error message</p>
```

### Backgrounds
```jsx
// Page backgrounds
<div className="bg-neutral-50">Light page background</div>
<div className="bg-neutral-100">Card background</div>

// Colored backgrounds
<div className="bg-primary-50">Light primary background</div>
<div className="bg-success-50">Light success background</div>
```

### Borders
```jsx
// Standard borders
<div className="border border-neutral-200">Default border</div>
<div className="border-2 border-primary-500">Primary border</div>
<div className="border border-error-300">Error border</div>
```

## 🎯 Color Usage Guidelines

1. **Primary Colors**: Use for main actions, navigation, and brand elements
2. **Secondary Colors**: Use for secondary actions and complementary elements
3. **Success Colors**: Use for positive feedback, confirmations, and success states
4. **Warning Colors**: Use for cautions, pending states, and important notices
5. **Error Colors**: Use for errors, destructive actions, and validation failures
6. **Neutral Colors**: Use for text, backgrounds, borders, and general UI elements

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── lib/           # Utility functions
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🎨 Styling

This project uses Tailwind CSS with custom color extensions. All colors are defined in `tailwind.config.js` and follow a consistent naming convention with semantic meaning.
