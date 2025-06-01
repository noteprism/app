# Material Design Elements

[← Back to Elements](../README.md)

This directory contains our Material Design 3 (Material You) foundational elements.

## Color System

The `color.ts` module provides Material You's dynamic color system integration:

### Core Functions

```typescript
import { argbFromHex, hexFromArgb, themeFromSourceColor } from './color';

// Convert colors
const brandColor = argbFromHex('#6750A4');
const hexColor = hexFromArgb(brandColor);

// Generate theme
const theme = themeFromSourceColor(brandColor);
```

### Features
- Color format conversion (HEX ↔ ARGB)
- Dynamic theme generation
- Light/dark scheme support
- Error handling for invalid inputs

### Testing
Tests in `color.test.ts` verify:
- Color conversion accuracy
- Invalid input handling
- Theme generation
- Light/dark scheme differences

## Implementation Status

✅ Completed
- Color system integration
- Unit tests
- Type exports

⏳ Planned
- Typography system
- Elevation system
- Shape system
- Motion system 