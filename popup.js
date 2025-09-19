// Simple JSON Formatter Popup Script
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const status = document.getElementById('status');
    const stats = document.getElementById('stats');
    const indentInput = document.getElementById('indent');
    const sortKeysInput = document.getElementById('sortKeys');

    // Button event listeners
    document.getElementById('format').addEventListener('click', formatJSON);
    document.getElementById('minify').addEventListener('click', minifyJSON);
    document.getElementById('validate').addEventListener('click', validateJSON);
    document.getElementById('copy').addEventListener('click', copyToClipboard);
    document.getElementById('clear').addEventListener('click', clearAll);

    // Auto-save settings
    indentInput.addEventListener('change', saveSettings);
    sortKeysInput.addEventListener('change', saveSettings);

    // Load saved settings
    loadSettings();

    function showStatus(message, type = 'success') {
        status.textContent = message;
        status.className = `status ${type}`;
        setTimeout(() => {
            status.textContent = '';
            status.className = '';
        }, 3000);
    }

    function updateStats(jsonData) {
        try {
            const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            const keys = countKeys(parsed);
            const size = new Blob([JSON.stringify(parsed)]).size;
            const lines = output.value.split('\n').length;
            
            stats.textContent = `${keys} keys • ${size} bytes • ${lines} lines`;
        } catch (e) {
            stats.textContent = '';
        }
    }

    function countKeys(obj, count = 0) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach(item => count += countKeys(item, 0));
            } else {
                count += Object.keys(obj).length;
                Object.values(obj).forEach(value => count += countKeys(value, 0));
            }
        }
        return count;
    }

    function formatJSON() {
        const inputText = input.value.trim();
        if (!inputText) {
            showStatus('Please enter some JSON data', 'error');
            return;
        }

        try {
            let parsed = JSON.parse(inputText);
            
            if (sortKeysInput.checked) {
                parsed = sortObjectKeys(parsed);
            }

            const indent = parseInt(indentInput.value) || 2;
            const formatted = JSON.stringify(parsed, null, indent);
            
            output.value = formatted;
            updateStats(parsed);
            showStatus('JSON formatted successfully! ✨');
        } catch (error) {
            showStatus(`Invalid JSON: ${error.message}`, 'error');
            output.value = '';
            stats.textContent = '';
        }
    }

    function minifyJSON() {
        const inputText = input.value.trim();
        if (!inputText) {
            showStatus('Please enter some JSON data', 'error');
            return;
        }

        try {
            const parsed = JSON.parse(inputText);
            const minified = JSON.stringify(parsed);
            
            output.value = minified;
            updateStats(parsed);
            showStatus('JSON minified successfully! 📦');
        } catch (error) {
            showStatus(`Invalid JSON: ${error.message}`, 'error');
            output.value = '';
        }
    }

    function validateJSON() {
        const inputText = input.value.trim();
        if (!inputText) {
            showStatus('Please enter some JSON data', 'error');
            return;
        }

        try {
            JSON.parse(inputText);
            showStatus('Valid JSON! ✅');
        } catch (error) {
            showStatus(`Invalid JSON: ${error.message}`, 'error');
        }
    }

    function sortObjectKeys(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
        }

        const sortedKeys = Object.keys(obj).sort();
        const sortedObj = {};
        
        sortedKeys.forEach(key => {
            sortedObj[key] = sortObjectKeys(obj[key]);
        });

        return sortedObj;
    }

    async function copyToClipboard() {
        const text = output.value;
        if (!text) {
            showStatus('Nothing to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showStatus('Copied to clipboard! 📋');
        } catch (error) {
            // Fallback for older browsers
            output.select();
            document.execCommand('copy');
            showStatus('Copied to clipboard! 📋');
        }
    }

    function clearAll() {
        input.value = '';
        output.value = '';
        stats.textContent = '';
        status.textContent = '';
        status.className = '';
        input.focus();
    }

    function saveSettings() {
        const settings = {
            indent: indentInput.value,
            sortKeys: sortKeysInput.checked
        };
        
        try {
            chrome.storage.sync.set({ jsonFormatterSettings: settings });
        } catch (error) {
            // Silently fail if storage is not available
            console.log('Storage not available:', error);
        }
    }

    function loadSettings() {
        try {
            chrome.storage.sync.get(['jsonFormatterSettings'], (result) => {
                if (result.jsonFormatterSettings) {
                    const settings = result.jsonFormatterSettings;
                    indentInput.value = settings.indent || 2;
                    sortKeysInput.checked = settings.sortKeys || false;
                }
            });
        } catch (error) {
            // Silently fail if storage is not available
            console.log('Storage not available:', error);
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    formatJSON();
                    break;
                case 'k':
                    e.preventDefault();
                    clearAll();
                    break;
            }
        }
    });
});
