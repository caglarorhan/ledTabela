# ⚠️ Important: How to Test the Extension Properly

## Why Buttons Don't Work in Browser

When you open `popup.html` directly in a browser or in the test files, the buttons **appear** but don't work because:

### Chrome Extension APIs Don't Work Outside Extension Context

The buttons use these Chrome APIs:
```javascript
chrome.tabs.query()      // Find active tab
chrome.tabs.sendMessage() // Send message to content script
```

These APIs **ONLY** work when:
- ✅ Extension is loaded in Chrome
- ✅ Popup is opened via extension icon
- ✅ User is on a valid GitHub page

They **DO NOT** work when:
- ❌ popup.html opened directly in browser
- ❌ popup.html loaded in iframe
- ❌ Testing in standalone HTML files

## ✅ Correct Testing Procedure

### Step 1: Load Extension in Chrome
1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable "Developer mode" (toggle top-right)
4. Click "Load unpacked"
5. Select folder: `D:\htdocs\chrome-extensions\ledTabela\ledTabela\`
6. Extension appears in list with purple icon

### Step 2: Navigate to GitHub
1. Go to any GitHub profile page with contributions
   - Example: `https://github.com/torvalds`
   - Or your own profile
2. You must see the contribution calendar (grid of squares)

### Step 3: Open Extension Popup
1. Click the LED Tabela icon in Chrome toolbar (top-right)
2. Popup opens (420x580px, dark theme)
3. NOW the buttons will work!

### Step 4: Test Features

#### Test Dropdowns ✓
- Color Chart dropdown should show: `defaultColors`, `fancyColors`, `lgbtColors`
- Color Picking dropdown should show: `Random`, `Lineer`

#### Test RUN Button ✓
1. Enter text in input: "TEST"
2. Select color chart: "fancyColors"
3. Select color picking: "Random"
4. Click "RUN" button
5. Check browser console (F12) - should see: "RUN button clicked"
6. Look at GitHub calendar - pattern should appear!

#### Test RESET Button ✓
1. Click "RESET" button
2. Check console - should see: "RESET button clicked"
3. Look at calendar - should clear to defaults
4. Success message appears: "Table reset!"

#### Test APPLY BG NOW Button ✓
1. Click color picker, choose color (e.g., red)
2. Click "Apply BG Now" button
3. Check console - should see: "Apply BG Now button clicked"
4. Calendar background changes to selected color
5. Success message appears: "Background color applied!"

## 🐛 Troubleshooting

### "Buttons still don't work"

**Check Console (F12):**
```javascript
// You should see these messages:
"RUN button clicked"
"RESET button clicked"  
"Apply BG Now button clicked"
```

If you see these messages, buttons ARE working - the issue is communication with content script.

**Verify Content Script Loaded:**
1. Open DevTools (F12) on GitHub page
2. Go to Console tab
3. Should see: `"test yuklendik..."`
4. If not, content script didn't load

**Check Active Tab:**
```javascript
// In popup console, test:
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    console.log('Active tab:', tabs[0]);
});
```

Should show GitHub URL.

### "Dropdowns are empty"

**In Extension Popup:**
1. Open popup via extension icon
2. Open DevTools on popup (right-click popup → Inspect)
3. Check console for errors
4. Run: `console.log(colorCharts)`
5. Should show object with 3 color schemes

**If undefined:**
- colorCharts.js not loaded
- Check manifest.json includes it
- Reload extension

### "Error: Cannot read property..."

**Means:**
- Element not found in DOM
- Script loaded before HTML ready
- Check element IDs match

## 📊 Expected Behavior

### When Popup Opens (Via Extension Icon):
1. ✅ Dropdowns populated immediately
2. ✅ Default values loaded from storage
3. ✅ Buttons enabled and clickable
4. ✅ No console errors

### When RUN Clicked:
1. ✅ Validates input (shows error if empty)
2. ✅ Validates color chart selected
3. ✅ Validates color picking selected
4. ✅ Button shows "RUNNING..."
5. ✅ Sends message to content script
6. ✅ Pattern appears on calendar
7. ✅ Success message shown
8. ✅ Button returns to "RUN"

### When RESET Clicked:
1. ✅ Sends reset message
2. ✅ Calendar clears to gray
3. ✅ Success message shown

### When APPLY BG NOW Clicked:
1. ✅ Gets color from picker
2. ✅ Sends paint message
3. ✅ Calendar background changes
4. ✅ Success message shown

## 🎯 Quick Verification Checklist

- [ ] Extension loaded in chrome://extensions/
- [ ] On GitHub profile page with calendar
- [ ] Popup opened via extension icon (NOT standalone file)
- [ ] Color Chart dropdown has 3 options
- [ ] Color Picking dropdown has 2 options
- [ ] Console shows button click messages
- [ ] Console shows "test yuklendik..." from content script
- [ ] Buttons respond with visual feedback
- [ ] Messages appear (success/error)
- [ ] Calendar updates when buttons clicked

## 💡 Key Points

1. **popup.html is NOT a standalone app** - it's a Chrome extension popup
2. **Chrome APIs only work in extension context** - not in regular browser
3. **Content script must be loaded on GitHub page** - for communication
4. **Test via extension icon** - not by opening HTML files directly
5. **Check console in both popup AND page** - for full debugging

## 🔧 Debug Mode

Add this to popup.js to test without GitHub:
```javascript
// Mock chrome.tabs for testing
if (!chrome.tabs) {
    window.chrome = {
        tabs: {
            query: (q, cb) => cb([{id: 1}]),
            sendMessage: (id, msg) => console.log('Mock send:', msg)
        }
    };
}
```

This allows standalone testing but won't actually work on GitHub.

## ✅ Verification Complete

If all checkboxes above are ✓, your extension is working correctly!

The buttons ARE functional - they just need proper Chrome extension environment to work.
