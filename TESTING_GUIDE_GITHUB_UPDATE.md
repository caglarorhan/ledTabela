# Testing Guide: GitHub Structure Update

## Quick Start Testing

### 1. Load the Extension
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select folder: `D:\htdocs\chrome-extensions\ledTabela\ledTabela\`
6. Verify extension appears in list with no errors

### 2. Basic Functionality Test
1. Navigate to any GitHub profile page with a contribution calendar
   - Example: `https://github.com/your-username`
2. Look for the contribution calendar (grid of squares)
3. Check if extension has injected:
   - **Data boxes** - Two new boxes above or near pinned repositories
   - **Pattern controls** - Select dropdown below the calendar with "Pattern Creation Options" label
   - **Color picker** - Next to the dropdown

### 3. Test Calendar Manipulation

#### Test 1: Click Individual Cells
1. Click on any contribution calendar cell (square)
2. Expected: Cell should change color
3. Verify color persists when clicking

#### Test 2: Clear Table
1. Click several calendar cells to add colors
2. Select "Clear The Table" from the dropdown
3. Expected: All colored cells return to default gray

#### Test 3: Paint Background
1. Select a color using the color picker
2. Select "Paint Table BG" from dropdown
3. Expected: All calendar cells change to selected color

#### Test 4: Write Data to Table
1. In the textarea (in data boxes), enter some pattern data
2. Select "Write Data To Table" from dropdown
3. Expected: Pattern appears on calendar

### 4. Test UI Components

#### Popup Test
1. Click the extension icon in Chrome toolbar
2. Verify popup opens with modern dark theme
3. Check all controls are visible:
   - Text input for word
   - Left margin control
   - Inter-letter space control
   - Animation speed slider
   - Color scheme selector
   - Direction buttons
   - Action buttons (Draw, Clear, etc.)
4. Test animation speed slider - verify value updates
5. Test each button responds to clicks

#### Data Boxes Test
1. On GitHub profile page, find the two injected data boxes
2. First box should have:
   - "Save2 LS Alphabet" button
   - "Draw" button
   - "Draw&Edit" checkbox
   - Textarea with "Written Data:" label
3. Second box should have:
   - "Saved Push/Commit Reminders Schedule" title
   - Search input field
   - Results list area

### 5. Test Advanced Features

#### Test Animation
1. In popup, enter a word (e.g., "TEST")
2. Select animation speed
3. Click "Draw with Animation"
4. Expected: Letters appear on calendar with animation effect

#### Test Color Schemes
1. In popup, select "Fancy Colors" from dropdown
2. Draw a pattern
3. Expected: Pattern uses fancy color scheme
4. Try "LGBT Colors" and "Default Colors"

#### Test Alphabet Storage
1. Create a custom pattern in the textarea
2. Click "Save2 LS Alphabet" button
3. Enter a key name
4. Reload the page
5. Search for your saved pattern
6. Expected: Pattern is retrieved from localStorage

### 6. Console Check
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for any errors (should be none)
4. You should see: "test yuklendik..." message

### 7. Compatibility Check

Test on different GitHub pages:
- [ ] Profile page with contributions (`github.com/username`)
- [ ] Profile page without contributions (new account)
- [ ] Profile page in dark mode
- [ ] Profile page with pinned repos
- [ ] Profile page without pinned repos

Expected behavior:
- Extension should work on pages WITH contribution calendar
- Extension should fail gracefully (no errors) on pages WITHOUT calendar

## Troubleshooting

### Issue: Controls don't appear
**Check:**
- Is there a contribution calendar on the page?
- Open console and look for JavaScript errors
- Verify selectors match current GitHub structure

### Issue: Clicking cells doesn't change color
**Check:**
- Are cells being selected? (Check console)
- Verify `td.ContributionCalendar-day` elements exist
- Check if `backgroundColor` style is being applied

### Issue: Data boxes don't appear
**Check:**
- Does the page have pinned repositories section?
- Look for `ol.d-flex.flex-wrap.list-style-none.gutter-condensed.mb-4`
- Extension adds boxes even if none exist

### Issue: Pattern controls missing
**Check:**
- Look for footer div with class `.width-full.f6.px-0.px-md-5.py-1`
- Controls should appear below the calendar legend

## Expected Console Messages

```
test yuklendik...
```

No errors should appear.

## Visual Verification

### Popup Appearance
- Width: 420px
- Height: 580px
- Dark theme with gradient header
- Blue gradient from #667eea to #764ba2
- All controls neatly organized
- Version badge in top right

### Injected Components on GitHub
- Data boxes blend with GitHub's native design
- Controls appear naturally below calendar
- Color picker easily accessible
- Dropdown menu styled consistently

## Reporting Issues

If you find bugs:
1. Note the GitHub page URL
2. Capture console errors (if any)
3. Take screenshot
4. Document steps to reproduce
5. Check browser version (Chrome recommended)

## Success Criteria

Extension is working correctly if:
- ✅ Loads without errors
- ✅ Contribution calendar cells respond to clicks
- ✅ Colors can be applied and changed
- ✅ Patterns can be drawn
- ✅ Data boxes appear (when pinned repos exist)
- ✅ Control dropdown appears below calendar
- ✅ Popup UI is modern and functional
- ✅ No console errors during normal operation
- ✅ Animation system works
- ✅ localStorage saves and retrieves data

## Next Steps

After successful testing:
1. Test on multiple GitHub profiles
2. Try various patterns and animations
3. Experiment with custom alphabets
4. Test all color schemes
5. Verify persistence across page reloads
6. Consider publishing to Chrome Web Store
