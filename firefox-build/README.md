# Firefox Build

This directory contains the Firefox-compatible version of the insidebar-ai extension.

## What Changed

| Area | Chrome (root) | Firefox (`/firefox-build/`) |
|------|--------------|------------------------------|
| Namespace | `chrome.*` | `browser.*` |
| Background | `service_worker` (MV3 service worker) | `scripts` array + `"type": "module"` (persistent background) |
| Sidebar | `side_panel` + `sidePanel` permission | `sidebar_action` manifest key |
| Sidebar API | `chrome.sidePanel.open({ windowId })` | `browser.sidebarAction.open()` |
| Async APIs | Callback-style | Promise-based (`await`) |
| Dynamic HTML | `element.innerHTML = html` | `setHTML(el, html)` via DOMParser |
| Manifest extras | — | `browser_specific_settings`, `data_collection_permissions`, `author` |

## Validating with addons-linter

Install and run Mozilla's official linter from the **repository root**:

```bash
# Install (once)
npm install --save-dev addons-linter

# Run the linter
npx addons-linter ./firefox-build
```

Or run it directly without installing:

```bash
npx addons-linter ./firefox-build
```

The linter will report any remaining policy violations. A clean run shows:

```
Your add-on has been linted with the following result:
0 errors, 0 warnings, 0 notices
```

## Loading in Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"** in the left panel
3. Click **"Load Temporary Add-on…"**
4. Navigate to the `firefox-build/` folder and select `manifest.json`

The extension will be loaded temporarily (until Firefox restarts). For permanent installation, the extension must be signed via [addons.mozilla.org](https://addons.mozilla.org).

## Notes

- `libs/Readability.js` is a third-party library and was not modified.
- Original files in the root directory are untouched.
- The `gecko.id` and `author` email in `manifest.json` use `@example.com` placeholders — replace with a real email before publishing.
