# UI System

[← Back to lib](../README.md)

A comprehensive design system for Noteprism, built with Material You's dynamic color system.

## Directory Structure
- [components/](components/README.md) - Reusable UI components
- [elements/](elements/README.md) - Basic UI building blocks
  - [material/](elements/material/README.md) - Material Design 3 elements
- [utils/](utils/README.md) - UI-specific utilities
- `material-color.ts` - Material You color system integration
- `material-color.test.ts` - Material color system tests

## Design Tokens

### Colors (Material You)
Generated dynamically from a source color using `elements/material/color.ts`:
- Primary Color
- Secondary Color
- Tertiary Color
- Error Color
- Neutral Color
- Neutral Variant Color
- Surface Colors
- Background Colors

### Typography
- Display (Large, Medium, Small)
- Headline (Large, Medium, Small)
- Title (Large, Medium, Small)
- Body (Large, Medium, Small)
- Label (Large, Medium, Small)

### Spacing
- 4px (Extra Small)
- 8px (Small)
- 16px (Medium)
- 24px (Large)
- 32px (Extra Large)
- 48px (2x Large)
- 64px (3x Large)

### Corner Radius
- None (0px)
- Extra Small (4px)
- Small (8px)
- Medium (12px)
- Large (16px)
- Extra Large (28px)
- Full (9999px)

### Elevation
- Level 0 (none)
- Level 1 (low)
- Level 2 (medium)
- Level 3 (high)
- Level 4 (highest)

## Current Components (To Be Styled)

### Layout Components
- Header Navigation
- Sidebar Navigation
- Main Content Area
- Status Bar
- Grid Layout System

### Data Display
- Note Card
- Task Card
- Content Preview
- Tag Display
- Connection Map

### Interactive Elements
- Quick Capture Button
- Tag Input
- Priority Selector
- Platform Selector
- Content Type Toggle

## Needed Components

### Basic Elements
- Button (Primary, Secondary, Text, Icon)
- Input Field
- Checkbox
- Radio Button
- Switch
- Select/Dropdown
- Text Area
- Progress Bar
- Loading Spinner
- Toast/Snackbar
- Dialog/Modal
- Tooltip
- Badge
- Icon
- Link
- Divider

### Complex Components
- Accordion
- Alert/Banner
- Avatar
- Breadcrumb
- Card
- Chip/Tag
- Data Table
- Date Picker
- Form
- List
- Menu
- Navigation Rail
- Pagination
- Search Bar
- Stepper
- Tabs
- Time Picker
- Tree View

### Layout Components
- App Bar
- Bottom Navigation
- Drawer
- Footer
- Grid System
- Navigation Drawer
- Side Sheet
- Toolbar

### Data Visualization
- Connection Graph
- Priority Matrix
- Timeline View
- Tag Cloud
- Progress Circle
- Gauge
- Heat Map

### Feedback Components
- Progress Indicator
- Skeleton Loader
- Error State
- Empty State
- Success State

## Implementation Status

✅ Material Color Utilities Integration
- Color conversion (hex ↔ ARGB)
- Theme generation from source color
- Light/dark scheme support
- Unit tests

⏳ Next Steps
1. Create basic elements
2. Implement theme provider
3. Build core components
4. Add component tests 