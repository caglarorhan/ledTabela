# 🚀 QUICK START: Loading Led Tabela in Chrome

## Step-by-Step Installation

### 1️⃣ **Open Chrome Extensions**
```
Navigate to: chrome://extensions/
Or: Menu (⋮) → More tools → Extensions
```

### 2️⃣ **Enable Developer Mode**
- Find toggle in top-right corner
- Click to enable (turns blue)

### 3️⃣ **Load Extension**
1. Click **"Load unpacked"** button
2. Navigate to: `d:\htdocs\chrome-extensions\ledTabela\ledTabela\`
3. Click **"Select Folder"**

### 4️⃣ **Verify Installation**
✅ Extension card appears with "Led Tabela" name  
✅ Icon displays in toolbar  
✅ No error messages  
✅ Extension toggle is ON  

---

## 🧪 Quick Test

1. **Go to GitHub**: https://github.com (any page)
2. **Open popup**: Click extension icon in toolbar
3. **Check dropdowns**: Should show color chart options
4. **Open DevTools**: F12 → Console
5. **Look for**: "test yuklendik..." message

---

## ⚠️ Troubleshooting

### Extension won't load?
- Check all icon files exist (led-tabela_16.png, 24, 32, 64, 128)
- Verify manifest.json has no syntax errors
- Make sure you selected the correct folder

### Popup won't open?
- Reload the extension (click reload icon)
- Check for errors on chrome://extensions/
- Right-click popup → Inspect → Check console

### Not working on GitHub?
- Refresh the GitHub page after loading extension
- Check host permissions in manifest
- Verify you're on https://github.com domain

---

## 📁 Extension Structure
```
ledTabela/
├── manifest.json          ✅ Manifest V3
├── popup.html             ✅ Extension popup
├── popup.js               ✅ Updated for V3
├── led-tabela.js          ✅ Content script
├── alphabet.js            ✅ Character data
├── colorCharts.js         ✅ Color schemes
├── itrs.js                ✅ UI interactions
└── led-tabela_*.png       ✅ Icons (16,24,32,64,128)
```

---

## 🎯 What's New in V3?

✨ Updated from Manifest V2 to V3  
✨ Modernized message passing APIs  
✨ Reorganized icon structure  
✨ Split permissions properly  
✨ Updated content security policy  

---

## 📖 Full Testing Guide

For comprehensive testing instructions, open:
**TESTING_GUIDE.html** in your browser

---

## ✅ Next Steps

After successful installation:
1. Complete all tests in TESTING_GUIDE.html
2. Mark off checklist items
3. Document any issues
4. Ready for Feature Enhancements!

---

**Need Help?** Check TESTING_GUIDE.html for detailed troubleshooting!
