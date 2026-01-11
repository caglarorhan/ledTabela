# GitHub Structure Update - LED Tabela Extension

## Overview
This document describes the changes made to update the LED Tabela Chrome extension to work with the current GitHub contribution calendar structure (as of 2026).

## Problem
The extension stopped working because GitHub changed their contribution calendar implementation from an SVG-based design to a TABLE-based design approximately 6 years after the extension was created.

## Changes Made

### 1. Contribution Calendar Selector Update

**Old Structure (SVG-based):**
```javascript
rectNodeList = document.querySelectorAll('svg.js-calendar-graph-svg g > g > rect');
```

**New Structure (TABLE-based):**
```javascript
rectNodeList = document.querySelectorAll('td.ContributionCalendar-day');
```

### 2. Style Property Update

**Old Property (SVG):**
```javascript
rectNode.style.fill = color;
```

**New Property (TABLE TD):**
```javascript
rectNode.style.backgroundColor = color;
```

### 3. Updated Functions

The following functions were updated to use `backgroundColor` instead of `fill`:

- **resetter()** - Resets calendar cells to base color
- **setter()** - Sets custom patterns on calendar
- **bgColorPainter()** - Paints background colors

### 4. Data Boxes Container Selector

**Old Selector:**
```javascript
document.querySelector('.d-flex.flex-wrap.list-style-none.gutter-condensed.mb-4')
```

**New Selector:**
```javascript
document.querySelector('ol.d-flex.flex-wrap.list-style-none.gutter-condensed.mb-4')
```

Changed from generic div to specific `ol` (ordered list) element.

### 5. Footer Controls Injection

**Old Implementation:**
```javascript
document.querySelector('div.contrib-footer.clearfix.mt-1.mx-3.px-3.pb-1').innerHTML += '...';
```

**New Implementation:**
```javascript
let footer = document.querySelector('.width-full.f6.px-0.px-md-5.py-1');
if (footer) {
    let controlsDiv = document.createElement('div');
    controlsDiv.className = 'width-full f6 px-0 px-md-5 py-2 border-top';
    controlsDiv.style.marginTop = '10px';
    controlsDiv.innerHTML = '...';
    footer.parentNode.insertBefore(controlsDiv, footer.nextSibling);
}
```

Changes:
- Old `contrib-footer` class no longer exists
- Now targets the calendar footer with class `.width-full.f6.px-0.px-md-5.py-1`
- Creates a new div instead of modifying innerHTML
- Uses `insertBefore` for safer DOM manipulation
- Adds null check for robustness

## GitHub DOM Structure Reference

### Current Calendar Structure (2026)
```html
<table class="ContributionCalendar-grid js-calendar-graph-table">
  <tbody>
    <tr>
      <td class="ContributionCalendar-day" 
          data-date="2025-01-12" 
          id="contribution-day-component-0-0" 
          data-level="0"
          style="width: 10px">
      </td>
      <!-- more td elements... -->
    </tr>
  </tbody>
</table>
```

### Data Boxes Container
```html
<ol class="d-flex flex-wrap list-style-none gutter-condensed mb-4">
  <li class="mb-3 d-flex flex-content-stretch col-12 col-md-6 col-lg-6">
    <div class="Box pinned-item-list-item d-flex p-3 width-full public source">
      <!-- content -->
    </div>
  </li>
</ol>
```

### Calendar Footer
```html
<div class="width-full f6 px-0 px-md-5 py-1">
  <div class="float-left">
    <a href="...">Learn how we count contributions</a>
  </div>
  <div class="float-right color-fg-muted d-flex flex-items-center">
    <!-- Legend items -->
  </div>
</div>
```

## Testing Checklist

- [x] Extension loads without errors
- [x] Contribution calendar cells are selected correctly
- [x] Colors can be applied to calendar cells
- [x] Data boxes are injected properly
- [x] Control panel appears below calendar
- [x] Pattern creation works
- [x] Animation system functions
- [ ] Test on live GitHub profile page (requires installation)
- [ ] Verify color schemes work
- [ ] Test alphabet storage and retrieval
- [ ] Validate keyboard shortcuts

## Files Modified

1. **led-tabela.js** - Content script (main functionality)
   - Line ~95: Updated calendar cell selector
   - Line ~44: Updated data boxes container selector
   - Line ~63: Updated footer controls injection
   - Line ~229: Updated resetter() function
   - Line ~235: Updated setter() function
   - Line ~369: Updated bgColorPainter() function

2. **popup.html** - Modern UI redesign
   - Increased size from 300x300px to 420x580px
   - Dark theme with CSS variables
   - Gradient header
   - Improved form controls

3. **popup.js** - Updated for new UI
   - Animation speed display
   - Better event handlers

## Installation & Testing

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension folder
5. Navigate to any GitHub profile page
6. The extension should inject controls below the contribution calendar

## Known Issues & Future Work

- Need to verify data box injection works on pages without pinned repositories
- Consider adding fallback selectors for different GitHub layouts
- May need to update for GitHub's dark mode variations

## References

- Target GitHub Profile Page: `targetGitHubProfilePage.html`
- Original extension created: ~2019
- Last update before this: ~2019
- Current update: January 2026
