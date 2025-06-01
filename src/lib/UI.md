# Noteprism UI System

## Design Tokens

### Colors (Material You)
- Primary Color
- Secondary Color
- Tertiary Color
- Error Color
- Neutral Color
- Neutral Variant Color
- Surface Colors
- Background Colors

### Typography
- Display Large
- Display Medium
- Display Small
- Headline Large
- Headline Medium
- Headline Small
- Title Large
- Title Medium
- Title Small
- Body Large
- Body Medium
- Body Small
- Label Large
- Label Medium
- Label Small

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
- Health Status Indicator
- Uptime Percentage Display
- Service Status Bar
- Historical Data Chart
- Metrics Display Card

### Interactive Elements
- Refresh Button
- Settings Toggle
- Time Period Selector
- Service Filter

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
- Area Chart
- Bar Chart
- Line Chart
- Pie Chart
- Sparkline
- Progress Circle
- Gauge
- Heat Map

### Feedback Components
- Progress Indicator
- Skeleton Loader
- Error State
- Empty State
- Success State

## Using Material Color Utilities

### Basic Usage

```typescript
import { 
  argbFromHex,
  themeFromSourceColor,
  applyTheme
} from '@material/material-color-utilities';

// Convert your brand color to ARGB
const brandColor = argbFromHex('#ff0000');

// Generate theme
const theme = themeFromSourceColor(brandColor);

// Apply theme to your app
applyTheme(theme, {target: document.body});
```

### Advanced Features

1. **Dynamic Color from Image**
```typescript
import { sourceColorFromImage } from '@material/material-color-utilities';

async function setThemeFromImage(imageElement) {
  const themeColor = await sourceColorFromImage(imageElement);
  const theme = themeFromSourceColor(themeColor);
  applyTheme(theme, {target: document.body});
}
```

2. **Custom Color Schemes**
```typescript
import { 
  CustomColorGroup,
  customColor
} from '@material/material-color-utilities';

const customColors: CustomColorGroup[] = [
  customColor(argbFromHex('#ff0000'), 'custom-red'),
  customColor(argbFromHex('#00ff00'), 'custom-green')
];

const theme = themeFromSourceColor(brandColor, customColors);
```

3. **Contrast Checking**
```typescript
import { Contrast } from '@material/material-color-utilities';

const isAccessible = Contrast.ratio(backgroundColor, textColor) >= 4.5;
```

4. **Color Blending**
```typescript
import { Blend } from '@material/material-color-utilities';

const blendedColor = Blend.harmonize(sourceColor, targetColor);
```

5. **Temperature-based Colors**
```typescript
import { Temperature } from '@material/material-color-utilities';

const warmColor = Temperature.analogous(sourceColor)[0];
const coolColor = Temperature.analogous(sourceColor)[2];
``` 