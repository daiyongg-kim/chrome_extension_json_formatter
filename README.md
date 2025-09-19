# JSON Formatter Chrome Extension

A powerful and elegant Chrome extension for formatting, validating, and beautifying JSON data with syntax highlighting and advanced features.

## 🚀 Features

### Core Functionality
- **JSON Formatting**: Beautiful, indented JSON with customizable spacing
- **JSON Minification**: Compact JSON for reduced file size
- **JSON Validation**: Real-time validation with detailed error messages
- **Syntax Highlighting**: Color-coded JSON for better readability
- **Auto-detection**: Automatically detects JSON content on web pages

### Advanced Features
- **Key Sorting**: Sort JSON keys alphabetically
- **Copy to Clipboard**: One-click copying of formatted JSON
- **Statistics**: Shows key count, file size, and line count
- **Settings Persistence**: Remembers your preferences
- **Keyboard Shortcuts**: Fast formatting with Ctrl+Enter
- **Right-click Context Menu**: Format selected JSON text
- **Page Enhancement**: Automatically enhances JSON response pages

### User Interface
- **Modern Design**: Clean, gradient-based interface
- **Responsive Layout**: Works on different screen sizes
- **Dark Theme**: JSON viewer with dark syntax highlighting
- **Status Notifications**: Clear feedback for all actions
- **Collapsible JSON**: Expand/collapse JSON sections

## 📦 Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store (link will be available after publishing)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The JSON Formatter icon will appear in your browser toolbar

## 🎯 How to Use

### Basic Usage
1. Click the JSON Formatter icon in your browser toolbar
2. Paste your JSON data in the input field
3. Click "Format" to beautify your JSON
4. Use "Minify" to compress the JSON
5. Click "Copy" to copy the result to clipboard

### Keyboard Shortcuts
- `Ctrl+Enter` (or `Cmd+Enter` on Mac): Format JSON
- `Ctrl+K` (or `Cmd+K` on Mac): Clear all fields
- `Esc`: Close modals

### Context Menu
1. Select any JSON text on a webpage
2. Right-click and choose "Format as JSON"
3. View the formatted result in a popup modal

### Auto-detection
The extension automatically detects JSON content on pages with:
- `application/json` content type
- `.json` file extensions
- API responses containing JSON

## ⚙️ Settings

### Formatting Options
- **Indent Size**: Choose between 0-8 spaces for indentation
- **Sort Keys**: Alphabetically sort JSON object keys
- **Auto-detect**: Automatically format JSON on compatible pages

### Storage
All settings are automatically saved and synced across your Chrome browsers.

## 🔧 Technical Details

### Files Structure
```
json-formatter/
├── manifest.json          # Extension configuration
├── popup.html             # Main interface
├── popup.js              # Popup functionality
├── content.js            # Page content enhancement
├── background.js         # Background service worker
├── icons/                # Extension icons
└── README.md            # This file
```

### Permissions
- `activeTab`: Access current tab for JSON detection
- `storage`: Save user preferences
- `contextMenus`: Right-click formatting option

### Browser Support
- Chrome 88+
- Chromium-based browsers (Edge, Brave, etc.)
- Manifest V3 compatible

## 🎨 Customization

### Adding Custom Themes
You can modify the CSS in `popup.html` to create custom themes:

```css
/* Dark theme example */
body {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.container {
    background: #1a1a1a;
    color: #ffffff;
}
```

### Extending Functionality
The extension is modular and easy to extend:

1. Add new formatting options in `popup.js`
2. Enhance page detection in `content.js`
3. Add new context menu items in `background.js`

## 🐛 Troubleshooting

### Common Issues

**Extension not working on some pages**
- Some pages may have Content Security Policy restrictions
- Try using the popup interface instead of auto-detection

**JSON not detected automatically**
- Ensure the page content type is `application/json`
- Use the manual formatting option in the popup

**Formatting very large JSON files**
- Large files (>1MB) may cause performance issues
- Consider using the minify function first

### Error Messages
- `Invalid JSON`: Check for syntax errors, missing quotes, or trailing commas
- `Nothing to copy`: Ensure you have formatted JSON in the output field
- `Permission denied`: The extension may not have access to the current page

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/json-formatter-extension.git

# Navigate to the directory
cd json-formatter-extension

# Load the extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this folder
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Changelog

### Version 1.0.0
- Initial release
- JSON formatting and minification
- Syntax highlighting
- Auto-detection of JSON pages
- Context menu integration
- Settings persistence
- Copy to clipboard functionality

## 🔮 Roadmap

### Upcoming Features
- [ ] JSON Schema validation
- [ ] Export to file functionality
- [ ] Compare two JSON objects
- [ ] JSON to CSV conversion
- [ ] Custom color themes
- [ ] Bookmark favorite JSON snippets
- [ ] Search within JSON structure
- [ ] Performance metrics
- [ ] Undo/Redo functionality
- [ ] Batch processing

## 💝 Support

If you find this extension helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📢 Share with others

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/your-username/json-formatter-extension/issues)
- **Email**: daiyongg.kim@gmail.com

---

Made with ❤️ by [Your Name]
