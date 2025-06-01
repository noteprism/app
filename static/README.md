# Static Assets

[← Back to root](../README.md)

This directory contains static files that are served at the root of the application.

## Favicon and App Icons

- `favicon.ico` - Default favicon (any size)
- `favicon.svg` - Vector favicon for modern browsers
- `favicon-96x96.png` - 96x96 PNG favicon
- `apple-touch-icon.png` - iOS/macOS icon

## Web App Manifest

- `site.webmanifest` - Progressive Web App manifest
- `web-app-manifest-192x192.png` - Small PWA icon
- `web-app-manifest-512x512.png` - Large PWA icon

## Usage

These files are referenced in `src/app.html` using `%sveltekit.assets%`:

```html
<!-- Favicons -->
<link rel="icon" href="%sveltekit.assets%/favicon.ico" sizes="any" />
<link rel="icon" href="%sveltekit.assets%/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="%sveltekit.assets%/favicon-96x96.png" sizes="96x96" />
<link rel="apple-touch-icon" href="%sveltekit.assets%/apple-touch-icon.png" />

<!-- Web App Manifest -->
<link rel="manifest" href="%sveltekit.assets%/site.webmanifest" />
```

## Adding New Static Assets

1. Place files directly in this directory
2. Reference them in your app using `%sveltekit.assets%/filename`
3. For new favicons or manifest icons, update `src/app.html` 