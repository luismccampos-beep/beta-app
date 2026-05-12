# AKMLEVA UI Component Library - Migration Guide

## Overview

This document outlines the modernization and refactoring of the AKMLEVA UI component library. The updated library follows modern React best practices with comprehensive accessibility support, performance optimizations, and intuitive API patterns.

## Key Improvements

### 1. Design Tokens System

Created a centralized design tokens system at `src/tokens/index.ts`:

- **Colors**: Semantic colors with HSL values for theme support
- **Spacing**: Consistent spacing scale (0.5rem to 24rem)
- **Typography**: Font families, sizes, weights, line heights
- **Border Radius**: Configurable radius tokens
- **Shadows**: Box shadow tokens
- **Z-Index**: Layer management
- **Animation**: Duration and easing functions
- **Focus Ring**: Accessibility-focused ring styles

### 2. Centralized Type System

Created comprehensive types at `src/types/index.ts`:

- **Base Types**: `BaseComponentProps`, `InteractiveComponentProps`, `FormComponentProps`
- **Variant Types**: Size, Color, Button, Alert, Badge variants
- **Position Types**: Position, Side, Align variants
- **Accessibility Types**: `AriaProps` for comprehensive ARIA support
- **Utility Types**: `WithRequired`, `WithOptional`, `VariantProps`

### 3. Component Refactoring

#### Button Component
**Features:**
- Full ARIA support (`aria-label`, `aria-busy`, `aria-disabled`)
- Loading state with spinner
- Keyboard navigation (Space, Enter)
- Icon support (left/right)
- Polymorphic rendering (`asChild`)
- Performance optimizations (`useMemo`, `React.memo`)
- `IconButton` variant for icon-only buttons

**Migration:**
```tsx
// Before
<Button variant="primary" loading={isLoading}>Save</Button>

// After
<Button variant="default" loading={isLoading}>Save</Button>
```

#### Input Component
**Features:**
- Built-in label support with `htmlFor` association
- Error state with ARIA (`aria-invalid`, `aria-describedby`)
- Helper text support
- Start/end adornments
- Size variants (sm, md, lg)
- Accessibility-first design

**Migration:**
```tsx
// Before
<Input label="Email" error={error} />

// After (same API, enhanced implementation)
<Input 
  label="Email" 
  error={error}
  helperText="We'll never share your email"
/>
```

#### Card Component
**Features:**
- Compound component pattern (Card, CardHeader, CardTitle, etc.)
- Polymorphic rendering
- Hover effects option
- Semantic HTML (heading levels)
- Flexible layout options

#### Badge Component
**Features:**
- Multiple variants (default, secondary, destructive, success, warning, info, outline)
- Size variants
- Optional dot indicator
- High contrast for accessibility

#### Alert Component
**Features:**
- Multiple severity levels (default, destructive, success, warning, info)
- Icon support
- Title and description components
- Action area support
- `role="alert"` for screen readers

#### Checkbox Component
**Features:**
- Indeterminate state support
- Size variants
- Keyboard navigation (Space)
- CheckboxGroup for grouping

#### Switch Component
**Features:**
- Size variants (sm, md, lg)
- Smooth animations
- `SwitchWithLabel` convenience component
- ARIA switch role

#### RadioGroup Component
**Features:**
- Keyboard navigation (arrow keys)
- Horizontal/vertical layout
- Size variants
- Group label and error support

#### Label Component
**Features:**
- Required indicator
- Visually hidden mode
- Size variants
- Error state styling

### 4. Accessibility Improvements

All components now include:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Attributes**: Proper roles, states, and properties
- **Focus Management**: Visible focus rings, focus trapping
- **Screen Reader Support**: Semantic HTML, descriptive labels
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Color Contrast**: High contrast ratios for readability

### 5. Performance Optimizations

- **React.memo**: Components memoized to prevent unnecessary re-renders
- **useMemo**: Expensive computations cached
- **useCallback**: Stable callback references
- **forwardRef**: Proper ref forwarding for all components
- **Tree-shaking**: Named exports for optimal bundling

### 6. Developer Experience

- **TypeScript**: Full type safety with comprehensive interfaces
- **Documentation**: JSDoc comments on all components
- **Examples**: Usage examples in component documentation
- **Intellisense**: IDE autocompletion and type hints

## API Patterns

### Composable Components

Components follow a compound pattern for flexibility:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Polymorphic Rendering

Use `asChild` to render as a different element:

```tsx
<Button asChild>
  <a href="/dashboard">Go to Dashboard</a>
</Button>

<Card asChild hoverable>
  <a href="/details">Clickable Card</a>
</Card>
```

### Controlled vs Uncontrolled

Components support both patterns:

```tsx
// Controlled
const [value, setValue] = React.useState('');
<Input value={value} onChange={setValue} />

// Uncontrolled
<Input defaultValue="initial" />
```

## Migration Checklist

- [ ] Update imports from old paths to new structure
- [ ] Review component props for any breaking changes
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Update tests for new component structure
- [ ] Review design token usage in consuming applications

## Backward Compatibility

Most components maintain API compatibility with previous versions. Breaking changes are minimal:

1. **Import paths**: May have changed for some components
2. **Type exports**: Some types now exported from `types` module
3. **Component variants**: Some variant names may have changed

## Future Enhancements

Planned improvements for future versions:

- [ ] Select component with full keyboard navigation
- [ ] Dialog/Modal with focus trapping
- [ ] Accordion with proper ARIA
- [ ] Tabs with keyboard navigation
- [ ] Tooltip with positioning
- [ ] Form primitives with react-hook-form integration
- [ ] Toast/Notification system
- [ ] Skeleton loading states
- [ ] Progress indicators

## Contributing

When adding new components:

1. Follow the established patterns (CVA for variants, forwardRef, etc.)
2. Include comprehensive JSDoc documentation
3. Add accessibility features (ARIA, keyboard navigation)
4. Export from `components/index.ts`
5. Update this migration guide

## Support

For questions or issues with the migration:

1. Check this guide for common patterns
2. Review component documentation in source files
3. Refer to the types for available props
4. Test with assistive technologies
