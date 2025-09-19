// Content script for JSON Formatter
(function() {
    'use strict';

    // Check if the current page contains JSON
    function detectAndFormatJSON() {
        const contentType = document.contentType || '';
        const url = window.location.href;
        
        // Check if this is a JSON response
        if (contentType.includes('application/json') || 
            url.includes('.json') || 
            isPageContainingOnlyJSON()) {
            
            enhanceJSONPage();
        }
    }

    function isPageContainingOnlyJSON() {
        const bodyText = document.body.textContent.trim();
        
        // Check if the page contains only JSON
        if (bodyText.startsWith('{') && bodyText.endsWith('}') ||
            bodyText.startsWith('[') && bodyText.endsWith(']')) {
            try {
                JSON.parse(bodyText);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    function enhanceJSONPage() {
        const bodyText = document.body.textContent.trim();
        
        try {
            const jsonData = JSON.parse(bodyText);
            
            // Create enhanced JSON viewer
            const container = document.createElement('div');
            container.id = 'json-formatter-container';
            container.style.cssText = `
                font-family: 'Courier New', monospace;
                background: #1e1e1e;
                color: #d4d4d4;
                padding: 20px;
                margin: 0;
                line-height: 1.6;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow: auto;
            `;

            // Add toolbar
            const toolbar = document.createElement('div');
            toolbar.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #2d2d30;
                border: 1px solid #3e3e42;
                border-radius: 6px;
                padding: 10px;
                display: flex;
                gap: 10px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;

            const createButton = (text, handler) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.cssText = `
                    background: #0e639c;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                `;
                btn.addEventListener('mouseenter', () => btn.style.background = '#1177bb');
                btn.addEventListener('mouseleave', () => btn.style.background = '#0e639c');
                btn.addEventListener('click', handler);
                return btn;
            };

            // Copy button
            toolbar.appendChild(createButton('📋 Copy', async () => {
                try {
                    await navigator.clipboard.writeText(container.textContent);
                    showNotification('Copied to clipboard!');
                } catch (e) {
                    console.error('Copy failed:', e);
                }
            }));

            // Format button
            toolbar.appendChild(createButton('✨ Format', () => {
                container.textContent = JSON.stringify(jsonData, null, 2);
                highlightJSON(container);
            }));

            // Minify button
            toolbar.appendChild(createButton('📦 Minify', () => {
                container.textContent = JSON.stringify(jsonData);
                highlightJSON(container);
            }));

            // Collapse/Expand button
            let isCollapsed = false;
            const collapseBtn = createButton('📁 Collapse', () => {
                if (isCollapsed) {
                    container.textContent = JSON.stringify(jsonData, null, 2);
                    highlightJSON(container);
                    collapseBtn.textContent = '📁 Collapse';
                    isCollapsed = false;
                } else {
                    container.innerHTML = createCollapsibleJSON(jsonData);
                    collapseBtn.textContent = '📂 Expand';
                    isCollapsed = true;
                }
            });
            toolbar.appendChild(collapseBtn);

            // Replace page content
            document.body.innerHTML = '';
            document.body.appendChild(toolbar);
            document.body.appendChild(container);
            
            // Initial formatting
            container.textContent = JSON.stringify(jsonData, null, 2);
            highlightJSON(container);

            // Add CSS for syntax highlighting
            addSyntaxHighlightingCSS();
            
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
    }

    function highlightJSON(container) {
        const text = container.textContent;
        container.innerHTML = text
            .replace(/("([^"\\]|\\.)*")(\s*:)/g, '<span class="json-key">$1</span>$3')
            .replace(/:\s*("([^"\\]|\\.)*")/g, ': <span class="json-string">$1</span>')
            .replace(/:\s*(-?\d+\.?\d*([eE][+-]?\d+)?)/g, ': <span class="json-number">$1</span>')
            .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');
    }

    function createCollapsibleJSON(obj, depth = 0) {
        const indent = '  '.repeat(depth);
        
        if (typeof obj !== 'object' || obj === null) {
            if (typeof obj === 'string') return `<span class="json-string">"${obj}"</span>`;
            if (typeof obj === 'number') return `<span class="json-number">${obj}</span>`;
            if (typeof obj === 'boolean') return `<span class="json-boolean">${obj}</span>`;
            if (obj === null) return `<span class="json-null">null</span>`;
            return String(obj);
        }

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            
            const items = obj.map(item => 
                `${indent}  ${createCollapsibleJSON(item, depth + 1)}`
            ).join(',\n');
            
            return `[
${items}
${indent}]`;
        } else {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '{}';
            
            const items = keys.map(key => 
                `${indent}  <span class="json-key">"${key}"</span>: ${createCollapsibleJSON(obj[key], depth + 1)}`
            ).join(',\n');
            
            return `{
${items}
${indent}}`;
        }
    }

    function addSyntaxHighlightingCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .json-key { color: #9cdcfe; }
            .json-string { color: #ce9178; }
            .json-number { color: #b5cea8; }
            .json-boolean { color: #569cd6; }
            .json-null { color: #569cd6; }
        `;
        document.head.appendChild(style);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4caf50;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 10001;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease-out;
        `;

        const keyframes = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectAndFormatJSON);
    } else {
        detectAndFormatJSON();
    }

})();
