# Enhanced Input Component

A beautiful, accessible, and feature-rich input component with floating labels, validation states, and mobile-friendly design.

## Features

- ✨ **Floating Labels** - Smooth animation when user types
- 🎨 **Multiple Variants** - default, crystal, and minimal styles
- 📱 **Mobile Friendly** - Touch targets meet accessibility guidelines
- ♿ **Accessible** - ARIA attributes and screen reader support
- ✅ **Validation States** - Error, success, and loading states
- 🎭 **Animations** - Smooth transitions and micro-interactions
- 🌙 **Dark Mode** - Automatic theme support
- 📏 **Responsive** - Adapts to different screen sizes

## Usage

```tsx
import { EnhancedInput } from './ui/EnhancedInput';

<EnhancedInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  variant="crystal"
  size="lg"
  required
  helpText="We'll never share your email"
  error={emailError}
  success={isValidEmail}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | The input label (required) |
| `variant` | `'default' \| 'crystal' \| 'minimal'` | `'crystal'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `error` | `string` | `undefined` | Error message to display |
| `success` | `boolean` | `undefined` | Show success state |
| `helpText` | `string` | `undefined` | Helper text below input |
| `fullWidth` | `boolean` | `true` | Whether to take full width |
| `required` | `boolean` | `false` | Mark field as required |
| `disabled` | `boolean` | `false` | Disable the input |

## Variants

### Default
Standard input with clean borders and subtle shadows.

### Crystal
Glass morphism effect with backdrop blur and transparency.

### Minimal
Underlined input style for modern, minimalist designs.

## Accessibility

- ARIA labels and descriptions
- Screen reader support
- Keyboard navigation
- High contrast mode support
- Reduced motion support

## Mobile Optimization

- Touch targets minimum 44px (48px on mobile)
- Prevents zoom on iOS with proper font sizing
- Responsive design for all screen sizes

## Styling

The component uses CSS custom properties for easy theming:

```css
:root {
  --crystal-primary-400: #f472b6;
  --crystal-accent-emerald: #10b981;
  --crystal-accent-red: #ef4444;
}