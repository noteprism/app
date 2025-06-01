# UI Elements

[← Back to UI](../README.md)

This directory contains the basic building blocks of our UI system. These elements are the foundation for all higher-level components.

## Directory Structure
- [material/](material/README.md) - Material Design 3 foundational elements
  - `color.ts` - Material You color system
  - `color.test.ts` - Color system tests

## Implementation Status

✅ Completed
- Material You color system integration
- Color system tests

⏳ Planned Elements

### Interactive
- Button (Primary, Secondary, Text, Icon)
- Input Field
- Checkbox
- Radio Button
- Switch
- Select/Dropdown
- Text Area

### Status & Progress
- Progress Bar
- Loading Spinner
- Toast/Snackbar
- Dialog/Modal
- Tooltip

### Visual Elements
- Badge
- Icon
- Link
- Divider

## Development Guidelines

Each element will:
1. Use Material You theming from `material/color.ts`
2. Be fully accessible (WCAG AA compliant)
3. Include comprehensive tests
4. Support both light and dark themes
5. Include usage documentation

## Testing

Elements should have tests for:
- Theme application
- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility
- State management (hover, focus, active, disabled)

## Design Tokens

### Colors
All elements use Material You's dynamic color system. See the [UI System documentation](../README.md) for details on:
- Primary, Secondary, and Tertiary colors
- Error and Surface colors
- Background and Neutral colors

### Typography
Elements follow our type scale:
- Display (Large, Medium, Small)
- Headline (Large, Medium, Small)
- Title (Large, Medium, Small)
- Body (Large, Medium, Small)
- Label (Large, Medium, Small)

### Spacing
Standard spacing units:
- 4px (Extra Small)
- 8px (Small)
- 16px (Medium)
- 24px (Large)
- 32px (Extra Large)
- 48px (2x Large)
- 64px (3x Large)

### Corner Radius
Available radius options:
- None (0px)
- Extra Small (4px)
- Small (8px)
- Medium (12px)
- Large (16px)
- Extra Large (28px)
- Full (9999px)

## Usage

Each element:
1. Is built with Material You theming
2. Follows WCAG accessibility guidelines
3. Includes comprehensive documentation
4. Has associated unit tests
5. Provides usage examples 