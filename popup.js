document.addEventListener('DOMContentLoaded', () => {
    // Initialize app
    initializeTabs();
    initializeTheme();
    initializeJsonParser();
    initializeXmlParser();
    initializeConverters();
    loadSavedSettings();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });

            // Save active tab
            saveSettings({ activeTab: targetTab });
        });
    });
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.addEventListener('click', () => {
        const body = document.body;
        const isLight = body.classList.toggle('light-theme');

        themeToggle.textContent = isLight ? '🌙 Dark' : '☀️ Light';
        saveSettings({ theme: isLight ? 'light' : 'dark' });
    });
}

// JSON Parser
function initializeJsonParser() {
    const input = document.getElementById('jsonInput');
    const output = document.getElementById('jsonOutput');
    const status = document.getElementById('jsonStatus');

    // Buttons
    document.getElementById('formatJson').addEventListener('click', () => formatJson());
    document.getElementById('minifyJson').addEventListener('click', () => minifyJson());
    document.getElementById('copyJson').addEventListener('click', () => copyToClipboard('jsonOutput'));
    document.getElementById('clearJson').addEventListener('click', () => clearJsonEditor());
    document.getElementById('uploadJson').addEventListener('change', (e) => handleFileUpload(e, 'json'));
}

// XML Parser
function initializeXmlParser() {
    const input = document.getElementById('xmlInput');
    const output = document.getElementById('xmlOutput');
    const status = document.getElementById('xmlStatus');

    // Buttons
    document.getElementById('formatXml').addEventListener('click', () => formatXml());
    document.getElementById('minifyXml').addEventListener('click', () => minifyXml());
    document.getElementById('copyXml').addEventListener('click', () => copyToClipboard('xmlOutput'));
    document.getElementById('clearXml').addEventListener('click', () => clearXmlEditor());
    document.getElementById('uploadXml').addEventListener('change', (e) => handleFileUpload(e, 'xml'));
}

// Converters
function initializeConverters() {
    const conversionButtons = document.querySelectorAll('.conversion-type');
    const input = document.getElementById('converterInput');
    const output = document.getElementById('converterOutput');

    let currentConversion = 'json-xml';

    // Conversion type selection
    conversionButtons.forEach(button => {
        button.addEventListener('click', () => {
            conversionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentConversion = button.getAttribute('data-conversion');

            // Update placeholder based on conversion type
            const [fromType] = currentConversion.split('-');
            input.placeholder = `Enter ${fromType.toUpperCase()} data to convert...`;
        });
    });

    // Convert button
    document.getElementById('convert').addEventListener('click', () => {
        const inputData = input.value.trim();
        if (!inputData) {
            showStatus('converterStatus', 'Please enter data to convert', 'error');
            return;
        }

        try {
            const convertedData = performConversion(inputData, currentConversion);
            output.value = convertedData;
            showStatus('converterStatus', 'Conversion successful!', 'success');
        } catch (error) {
            showStatus('converterStatus', `Conversion error: ${error.message}`, 'error');
            output.value = '';
        }
    });

    // Other buttons
    document.getElementById('copyOutput').addEventListener('click', () => copyToClipboard('converterOutput'));
    document.getElementById('clearConverter').addEventListener('click', () => clearConverterEditor());
}

// JSON Functions
function formatJson() {
    const input = document.getElementById('jsonInput');
    const output = document.getElementById('jsonOutput');
    const inputText = input.value.trim();

    if (!inputText) {
        showStatus('jsonStatus', 'Please enter JSON data', 'error');
        return;
    }

    try {
        const parsed = JSON.parse(inputText);
        const formatted = JSON.stringify(parsed, null, 2);

        // Display formatted JSON with syntax highlighting
        output.innerHTML = syntaxHighlightJson(formatted);
        showStatus('jsonStatus', 'JSON formatted successfully!', 'success');
    } catch (error) {
        showStatus('jsonStatus', `Invalid JSON: ${error.message}`, 'error');
        output.innerHTML = '<span class="placeholder">Invalid JSON</span>';
    }
}

function minifyJson() {
    const input = document.getElementById('jsonInput');
    const output = document.getElementById('jsonOutput');
    const inputText = input.value.trim();

    if (!inputText) {
        showStatus('jsonStatus', 'Please enter JSON data', 'error');
        return;
    }

    try {
        const parsed = JSON.parse(inputText);
        const minified = JSON.stringify(parsed);

        output.innerHTML = `<pre style="margin: 0; color: var(--dark-text);">${escapeHtml(minified)}</pre>`;
        showStatus('jsonStatus', 'JSON minified successfully!', 'success');
    } catch (error) {
        showStatus('jsonStatus', `Invalid JSON: ${error.message}`, 'error');
        output.innerHTML = '<span class="placeholder">Invalid JSON</span>';
    }
}

// XML Functions
function formatXml() {
    const input = document.getElementById('xmlInput');
    const output = document.getElementById('xmlOutput');
    const inputText = input.value.trim();

    if (!inputText) {
        showStatus('xmlStatus', 'Please enter XML data', 'error');
        return;
    }

    try {
        const formatted = formatXmlString(inputText);
        output.innerHTML = syntaxHighlightXml(formatted);
        showStatus('xmlStatus', 'XML formatted successfully!', 'success');
    } catch (error) {
        showStatus('xmlStatus', `Invalid XML: ${error.message}`, 'error');
        output.innerHTML = '<span class="placeholder">Invalid XML</span>';
    }
}

function minifyXml() {
    const input = document.getElementById('xmlInput');
    const output = document.getElementById('xmlOutput');
    const inputText = input.value.trim();

    if (!inputText) {
        showStatus('xmlStatus', 'Please enter XML data', 'error');
        return;
    }

    try {
        const minified = inputText.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
        output.innerHTML = `<pre style="margin: 0; color: var(--dark-text);">${escapeHtml(minified)}</pre>`;
        showStatus('xmlStatus', 'XML minified successfully!', 'success');
    } catch (error) {
        showStatus('xmlStatus', `Error: ${error.message}`, 'error');
    }
}

// Conversion Functions
function performConversion(data, conversionType) {
    const [fromType, toType] = conversionType.split('-');

    switch (conversionType) {
        case 'json-xml':
            return jsonToXml(JSON.parse(data));
        case 'json-csv':
            return jsonToCsv(JSON.parse(data));
        case 'json-yaml':
            return jsonToYaml(JSON.parse(data));
        case 'xml-json':
            return xmlToJson(data);
        case 'csv-json':
            return csvToJson(data);
        case 'yaml-json':
            return yamlToJson(data);
        default:
            throw new Error('Unsupported conversion type');
    }
}

function jsonToXml(obj, rootName = 'root') {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;

    function convertObject(obj, indent = '  ') {
        let result = '';
        for (const [key, value] of Object.entries(obj)) {
            if (value === null || value === undefined) {
                result += `\n${indent}<${key}/>`;
            } else if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        result += `\n${indent}<${key}>`;
                        if (typeof item === 'object') {
                            result += convertObject(item, indent + '  ');
                            result += `\n${indent}`;
                        } else {
                            result += escapeXml(String(item));
                        }
                        result += `</${key}>`;
                    });
                } else {
                    result += `\n${indent}<${key}>`;
                    result += convertObject(value, indent + '  ');
                    result += `\n${indent}</${key}>`;
                }
            } else {
                result += `\n${indent}<${key}>${escapeXml(String(value))}</${key}>`;
            }
        }
        return result;
    }

    xml += convertObject(obj);
    xml += `\n</${rootName}>`;
    return xml;
}

function jsonToCsv(json) {
    if (!Array.isArray(json)) {
        json = [json];
    }

    if (json.length === 0) return '';

    const headers = Object.keys(json[0]);
    const csv = [
        headers.join(','),
        ...json.map(row =>
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',')
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            }).join(',')
        )
    ];

    return csv.join('\n');
}

function jsonToYaml(obj, indent = '') {
    let yaml = '';

    for (const [key, value] of Object.entries(obj)) {
        if (value === null) {
            yaml += `${indent}${key}: null\n`;
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                yaml += `${indent}${key}:\n`;
                value.forEach(item => {
                    if (typeof item === 'object') {
                        yaml += `${indent}- \n${jsonToYaml(item, indent + '  ')}`;
                    } else {
                        yaml += `${indent}- ${item}\n`;
                    }
                });
            } else {
                yaml += `${indent}${key}:\n${jsonToYaml(value, indent + '  ')}`;
            }
        } else {
            yaml += `${indent}${key}: ${value}\n`;
        }
    }

    return yaml;
}

function xmlToJson(xmlString) {
    // Simple XML to JSON conversion (basic implementation)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    function xmlNodeToJson(node) {
        const obj = {};

        if (node.nodeType === 1) { // Element node
            if (node.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let i = 0; i < node.attributes.length; i++) {
                    const attr = node.attributes.item(i);
                    obj['@attributes'][attr.nodeName] = attr.nodeValue;
                }
            }

            if (node.hasChildNodes()) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    const child = node.childNodes.item(i);
                    const nodeName = child.nodeName;

                    if (child.nodeType === 3) { // Text node
                        const text = child.nodeValue.trim();
                        if (text) {
                            return text;
                        }
                    } else if (child.nodeType === 1) { // Element node
                        if (obj[nodeName] === undefined) {
                            obj[nodeName] = xmlNodeToJson(child);
                        } else {
                            if (!Array.isArray(obj[nodeName])) {
                                obj[nodeName] = [obj[nodeName]];
                            }
                            obj[nodeName].push(xmlNodeToJson(child));
                        }
                    }
                }
            }
        }

        return obj;
    }

    const result = xmlNodeToJson(xmlDoc.documentElement);
    return JSON.stringify({ [xmlDoc.documentElement.nodeName]: result }, null, 2);
}

function csvToJson(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        result.push(obj);
    }

    return JSON.stringify(result, null, 2);
}

function yamlToJson(yaml) {
    // Basic YAML to JSON conversion
    const lines = yaml.trim().split('\n');
    const result = {};
    let currentObj = result;
    let stack = [result];
    let currentIndent = 0;

    lines.forEach(line => {
        const indent = line.search(/\S/);
        const trimmed = line.trim();

        if (trimmed.startsWith('- ')) {
            // Array item
            const value = trimmed.substring(2).trim();
            const parent = stack[stack.length - 1];
            const lastKey = Object.keys(parent).pop();
            if (!Array.isArray(parent[lastKey])) {
                parent[lastKey] = [];
            }
            parent[lastKey].push(value);
        } else if (trimmed.includes(':')) {
            const [key, value] = trimmed.split(':').map(s => s.trim());

            if (indent < currentIndent) {
                stack.pop();
                currentObj = stack[stack.length - 1];
            }

            if (value) {
                currentObj[key] = value === 'null' ? null : value;
            } else {
                currentObj[key] = {};
                stack.push(currentObj[key]);
                currentObj = currentObj[key];
            }

            currentIndent = indent;
        }
    });

    return JSON.stringify(result, null, 2);
}

// Utility Functions

function formatXmlString(xml) {
    const PADDING = '  ';
    let formatted = '';
    let indent = '';

    xml.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) {
            indent = indent.substring(PADDING.length);
        }
        formatted += indent + '<' + node + '>\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) {
            indent += PADDING;
        }
    });

    return formatted.substring(1, formatted.length - 2);
}

function syntaxHighlightJson(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<pre style="margin: 0;">' + json.replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span style="color: ' + getHighlightColor(cls) + '">' + match + '</span>';
    }) + '</pre>';
}

function syntaxHighlightXml(xml) {
    xml = xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<pre style="margin: 0;">' + xml.replace(/(&lt;\/?)(\w+)(.*?)(&gt;)/g, function(match, p1, p2, p3, p4) {
        return '<span style="color: #569CD6">' + p1 + p2 + '</span>' +
               '<span style="color: #9CDCFE">' + p3 + '</span>' +
               '<span style="color: #569CD6">' + p4 + '</span>';
    }) + '</pre>';
}

function getHighlightColor(cls) {
    const colors = {
        'json-key': '#9CDCFE',
        'json-string': '#CE9178',
        'json-number': '#B5CEA8',
        'json-boolean': '#569CD6',
        'json-null': '#569CD6'
    };
    return colors[cls] || '#D4D4D4';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function showStatus(statusId, message, type) {
    const status = document.getElementById(statusId);
    status.textContent = message;
    status.className = `status-bar ${type}`;
    status.style.display = 'block';

    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}

async function copyToClipboard(outputId) {
    const output = document.getElementById(outputId);
    const text = output.textContent || output.value;

    if (!text) {
        const statusId = outputId.replace('Output', 'Status');
        showStatus(statusId, 'Nothing to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        const statusId = outputId.replace('Output', 'Status');
        showStatus(statusId, 'Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Copy failed:', error);
    }
}

function clearJsonEditor() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('jsonOutput').innerHTML = '<span class="placeholder">Enter JSON to see formatted output</span>';
}

function clearXmlEditor() {
    document.getElementById('xmlInput').value = '';
    document.getElementById('xmlOutput').innerHTML = '<span class="placeholder">Enter XML to see formatted output</span>';
}

function clearConverterEditor() {
    document.getElementById('converterInput').value = '';
    document.getElementById('converterOutput').value = '';
}

function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        const statusId = type === 'json' ? 'jsonStatus' : 'xmlStatus';
        showStatus(statusId, 'File size exceeds 10MB limit', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const inputId = type === 'json' ? 'jsonInput' : 'xmlInput';

        document.getElementById(inputId).value = content;
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// Settings Management
function saveSettings(newSettings) {
    try {
        chrome.storage.sync.get(['extensionSettings'], (result) => {
            const settings = result.extensionSettings || {};
            Object.assign(settings, newSettings);
            chrome.storage.sync.set({ extensionSettings: settings });
        });
    } catch (error) {
        // Fallback to localStorage for testing
        const settings = JSON.parse(localStorage.getItem('extensionSettings') || '{}');
        Object.assign(settings, newSettings);
        localStorage.setItem('extensionSettings', JSON.stringify(settings));
    }
}

function loadSavedSettings() {
    try {
        chrome.storage.sync.get(['extensionSettings'], (result) => {
            applySettings(result.extensionSettings || {});
        });
    } catch (error) {
        // Fallback to localStorage for testing
        const settings = JSON.parse(localStorage.getItem('extensionSettings') || '{}');
        applySettings(settings);
    }
}

function applySettings(settings) {
    // Apply theme
    if (settings.theme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeToggle').textContent = '🌙 Dark';
    }

    // Apply active tab
    if (settings.activeTab) {
        const tabButton = document.querySelector(`.tab-button[data-tab="${settings.activeTab}"]`);
        if (tabButton) {
            tabButton.click();
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                // Format current active tab
                const activeTab = document.querySelector('.tab-content.active').id;
                if (activeTab === 'json-tab') {
                    formatJson();
                } else if (activeTab === 'xml-tab') {
                    formatXml();
                } else if (activeTab === 'converters-tab') {
                    document.getElementById('convert').click();
                }
                break;
            case 'k':
                e.preventDefault();
                // Clear current active tab
                const currentTab = document.querySelector('.tab-content.active').id;
                if (currentTab === 'json-tab') {
                    clearJsonEditor();
                } else if (currentTab === 'xml-tab') {
                    clearXmlEditor();
                } else if (currentTab === 'converters-tab') {
                    clearConverterEditor();
                }
                break;
        }
    }
});