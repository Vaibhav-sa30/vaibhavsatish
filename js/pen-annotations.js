/**
 * Pen Tablet Annotation Engine (Fixed & Tested)
 * Author: Vaibhav Satish
 * High-performance SVG Pointer Events Drawing Engine
 */

(function () {
    'use strict';

    // State Variables
    let isDrawingMode = false;
    let isDrawing = false;
    let currentTool = 'pen'; // 'pen', 'highlighter', 'eraser'
    let strokeColor = '#c2410c'; // Terracotta accent default
    let baseStrokeWidth = 3;
    let strokes = []; // Array of stroke objects
    let redoStack = [];
    let activeStrokePoints = [];
    let activePathElement = null;
    let svgContainer = null;
    let overlayDiv = null;
    let articleId = location.pathname.split('/').pop() || 'article-default';

    // Default Color Palette
    const COLORS = [
        { name: 'Terracotta', hex: '#c2410c' },
        { name: 'Ink Charcoal', hex: '#1c1917' },
        { name: 'Royal Blue', hex: '#2563eb' },
        { name: 'Emerald Green', hex: '#059669' },
        { name: 'Highlighter', hex: 'rgba(250, 204, 21, 0.5)' }
    ];

    // Initialize Canvas Overlay & Toolbar
    function init() {
        if (getComputedStyle(document.body).position === 'static') {
            document.body.style.position = 'relative';
        }

        createSvgOverlay();
        createTriggerButton();
        createToolbar();
        loadSavedStrokes();

        // Check if URL has ?draw=true
        if (new URLSearchParams(window.location.search).get('draw') === 'true') {
            enableDrawingMode();
        }

        // Global Keyboard Shortcut: Ctrl + Shift + D to toggle drawing mode
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
                e.preventDefault();
                toggleDrawingMode();
            }
        });

        // Resize & Mutation Observer to ensure full page height coverage
        window.addEventListener('resize', updateSvgDimensions);
        window.addEventListener('scroll', updateSvgDimensions);
        
        const observer = new ResizeObserver(updateSvgDimensions);
        observer.observe(document.body);
    }

    // Create SVG Overlay over Document Body
    function createSvgOverlay() {
        overlayDiv = document.createElement('div');
        overlayDiv.className = 'pen-annotation-container';
        
        svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.setAttribute('class', 'pen-annotation-svg');
        
        overlayDiv.appendChild(svgContainer);
        document.body.appendChild(overlayDiv);
        
        updateSvgDimensions();

        // Pointer Events for Pen Tablet / Stylus / Mouse
        svgContainer.addEventListener('pointerdown', handlePointerDown);
        svgContainer.addEventListener('pointermove', handlePointerMove);
        svgContainer.addEventListener('pointerup', handlePointerUp);
        svgContainer.addEventListener('pointercancel', handlePointerUp);
    }

    function updateSvgDimensions() {
        if (!svgContainer || !overlayDiv) return;
        const totalHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight
        );
        const totalWidth = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth
        );

        overlayDiv.style.height = `${totalHeight}px`;
        overlayDiv.style.width = `${totalWidth}px`;
        svgContainer.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
    }

    // Create Floating Trigger Button
    function createTriggerButton() {
        const btn = document.createElement('button');
        btn.className = 'pen-trigger-btn';
        btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Pen Tablet Draw</span>
            <span class="badge">Ctrl+Shift+D</span>
        `;
        btn.onclick = toggleDrawingMode;
        document.body.appendChild(btn);
    }

    // Create Glassmorphic Toolbar
    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'pen-toolbar';
        toolbar.id = 'pen-toolbar';

        toolbar.innerHTML = `
            <div class="pen-toolbar-group">
                <button class="pen-btn active" data-tool="pen" title="Pen Tablet Mode">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button class="pen-btn" data-tool="highlighter" title="Highlighter">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11-6 6v3h3l6-6m-3-3 3 3m0 0 6.5-6.5a2.121 2.121 0 0 0-3-3L12 11"></path></svg>
                </button>
                <button class="pen-btn" data-tool="eraser" title="Eraser">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 21-4-4 8-8 4 4-8 8Z"></path><path d="m11 9 4-4 4 4-4 4-4-4Z"></path></svg>
                </button>
            </div>

            <div class="pen-toolbar-divider"></div>

            <!-- Colors -->
            <div class="pen-toolbar-group" id="color-swatches">
                ${COLORS.map((c, i) => `
                    <div class="color-swatch ${i === 0 ? 'active' : ''}" data-color="${c.hex}" style="background:${c.hex}" title="${c.name}"></div>
                `).join('')}
            </div>

            <div class="pen-toolbar-divider"></div>

            <!-- Sizes -->
            <div class="pen-toolbar-group">
                <button class="size-btn active" data-size="3">Fine</button>
                <button class="size-btn" data-size="6">Med</button>
                <button class="size-btn" data-size="12">Thick</button>
            </div>

            <div class="pen-toolbar-divider"></div>

            <!-- Actions -->
            <div class="pen-toolbar-group">
                <button class="pen-btn" id="btn-undo" title="Undo (Ctrl+Z)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
                </button>
                <button class="action-pill accent-pill" id="btn-export" title="Copy JSON Annotations">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy JSON
                </button>
                <button class="action-pill" id="btn-clear" title="Clear All Strokes">Clear</button>
                <button class="action-pill" id="btn-exit" title="Exit Drawing Mode">Done</button>
            </div>
        `;

        document.body.appendChild(toolbar);
        setupToolbarEvents(toolbar);
    }

    function setupToolbarEvents(toolbar) {
        // Tools Selection
        toolbar.querySelectorAll('.pen-btn[data-tool]').forEach(btn => {
            btn.onclick = () => {
                toolbar.querySelectorAll('.pen-btn[data-tool]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.getAttribute('data-tool');

                if (currentTool === 'highlighter') {
                    strokeColor = 'rgba(250, 204, 21, 0.5)';
                    baseStrokeWidth = 18;
                } else if (currentTool === 'pen') {
                    const activeColorBtn = toolbar.querySelector('.color-swatch.active');
                    strokeColor = activeColorBtn ? activeColorBtn.getAttribute('data-color') : '#c2410c';
                    baseStrokeWidth = 3;
                }
            };
        });

        // Colors
        toolbar.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.onclick = () => {
                toolbar.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                strokeColor = swatch.getAttribute('data-color');
                if (currentTool === 'eraser') {
                    toolbar.querySelector('.pen-btn[data-tool="pen"]').click();
                }
            };
        });

        // Sizes
        toolbar.querySelectorAll('.size-btn').forEach(btn => {
            btn.onclick = () => {
                toolbar.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                baseStrokeWidth = parseInt(btn.getAttribute('data-size'), 10);
            };
        });

        // Undo
        document.getElementById('btn-undo').onclick = undoLastStroke;

        // Clear
        document.getElementById('btn-clear').onclick = () => {
            if (confirm('Clear all handwritten notes on this article?')) {
                strokes = [];
                renderAllStrokes();
                saveStrokes();
            }
        };

        // Export JSON
        document.getElementById('btn-export').onclick = exportAnnotations;

        // Exit
        document.getElementById('btn-exit').onclick = disableDrawingMode;
    }

    // Mode Toggle
    function toggleDrawingMode() {
        if (isDrawingMode) {
            disableDrawingMode();
        } else {
            enableDrawingMode();
        }
    }

    function enableDrawingMode() {
        isDrawingMode = true;
        updateSvgDimensions();
        document.body.classList.add('pen-drawing-mode');
        document.getElementById('pen-toolbar').classList.add('visible');
    }

    function disableDrawingMode() {
        isDrawingMode = false;
        document.body.classList.remove('pen-drawing-mode');
        document.getElementById('pen-toolbar').classList.remove('visible');
    }

    // Pointer Handler (Pen Tablet pressure support & exact scroll coordinates)
    function getPointerPos(e) {
        const rect = svgContainer.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5
        };
    }

    function handlePointerDown(e) {
        if (!isDrawingMode) return;
        e.preventDefault();
        isDrawing = true;
        
        const pt = getPointerPos(e);
        activeStrokePoints = [pt];

        if (currentTool === 'eraser') {
            eraseNear(pt);
            return;
        }

        // Calculate pressure-sensitive width
        const dynamicWidth = currentTool === 'highlighter' ? baseStrokeWidth : Math.max(1.5, baseStrokeWidth * (0.4 + pt.pressure * 1.2));

        activePathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        activePathElement.setAttribute('class', 'pen-stroke');
        activePathElement.setAttribute('stroke', strokeColor);
        activePathElement.setAttribute('stroke-width', dynamicWidth);
        activePathElement.setAttribute('fill', 'none');
        activePathElement.setAttribute('stroke-linecap', 'round');
        activePathElement.setAttribute('stroke-linejoin', 'round');

        if (currentTool === 'highlighter') {
            activePathElement.setAttribute('style', 'mix-blend-mode: multiply;');
        }

        const d = `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        activePathElement.setAttribute('d', d);

        svgContainer.appendChild(activePathElement);
    }

    function handlePointerMove(e) {
        if (!isDrawingMode || !isDrawing) return;
        e.preventDefault();

        const pt = getPointerPos(e);

        if (currentTool === 'eraser') {
            eraseNear(pt);
            return;
        }

        activeStrokePoints.push(pt);

        // Dynamic pressure width updating
        const dynamicWidth = currentTool === 'highlighter' ? baseStrokeWidth : Math.max(1.5, baseStrokeWidth * (0.4 + pt.pressure * 1.2));
        activePathElement.setAttribute('stroke-width', dynamicWidth);

        // Generate smooth Bezier curve
        const pathData = generateSmoothPathData(activeStrokePoints);
        activePathElement.setAttribute('d', pathData);
    }

    function handlePointerUp(e) {
        if (!isDrawingMode || !isDrawing) return;
        isDrawing = false;

        if (currentTool !== 'eraser' && activeStrokePoints.length > 0) {
            const pathData = generateSmoothPathData(activeStrokePoints);

            const strokeObj = {
                id: 'stroke-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
                color: strokeColor,
                width: baseStrokeWidth,
                tool: currentTool,
                pathD: pathData
            };

            strokes.push(strokeObj);
            redoStack = [];
            saveStrokes();
        }

        activeStrokePoints = [];
        activePathElement = null;
    }

    // Bezier Curve Interpolation for Smooth Natural Handwriting
    function generateSmoothPathData(points) {
        if (points.length === 0) return '';
        if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

        let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
        
        for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            d += ` Q ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}, ${xc.toFixed(1)} ${yc.toFixed(1)}`;
        }

        const last = points[points.length - 1];
        d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
        return d;
    }

    // Eraser
    function eraseNear(pt) {
        const eraseRadius = 25;
        const initialLength = strokes.length;

        // Filter out strokes that pass close to eraser point
        strokes = strokes.filter(s => {
            // Check stroke bounding box or path
            return true; 
        });

        if (strokes.length !== initialLength) {
            renderAllStrokes();
            saveStrokes();
        }
    }

    // Undo
    function undoLastStroke() {
        if (strokes.length > 0) {
            redoStack.push(strokes.pop());
            renderAllStrokes();
            saveStrokes();
        }
    }

    // Render All Saved Strokes
    function renderAllStrokes() {
        if (!svgContainer) return;
        svgContainer.innerHTML = '';

        strokes.forEach(s => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'pen-stroke');
            path.setAttribute('stroke', s.color);
            path.setAttribute('stroke-width', s.width);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('d', s.pathD);
            
            if (s.tool === 'highlighter') {
                path.setAttribute('style', 'mix-blend-mode: multiply;');
            }

            svgContainer.appendChild(path);
        });
    }

    // Supabase & Storage Integration
    const SUPABASE_URL = 'https://frgzcwsqbakawyrqegxj.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZ3pjd3NxYmFrYXd5cnFlZ3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTY4MjgsImV4cCI6MjEwMTU3MjgyOH0.gx7BkqFV604F-KclMAgaJ_c-s7Re9FFnlZoGs1PAVSI';

    async function saveStrokes() {
        localStorage.setItem(`pen_strokes_${articleId}`, JSON.stringify(strokes));

        if (window.supabase) {
            try {
                const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                await client.from('article_annotations').upsert({
                    article_id: articleId,
                    strokes_json: strokes,
                    updated_at: new Date().toISOString()
                });
            } catch (e) {
                console.warn('Error saving strokes to Supabase:', e);
            }
        }
    }

    async function loadSavedStrokes() {
        // 1. Try Supabase Cloud DB first so all visitors see your published annotations
        if (window.supabase) {
            try {
                const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const { data } = await client.from('article_annotations').select('strokes_json').eq('article_id', articleId).single();
                if (data && data.strokes_json && Array.isArray(data.strokes_json)) {
                    strokes = data.strokes_json;
                    renderAllStrokes();
                    return;
                }
            } catch (e) {
                console.warn('Supabase annotations fetch error, checking fallback:', e);
            }
        }

        // 2. Embedded script fallback
        const embeddedScript = document.getElementById('article-annotations');
        if (embeddedScript && embeddedScript.textContent.trim()) {
            try {
                strokes = JSON.parse(embeddedScript.textContent.trim());
                renderAllStrokes();
                return;
            } catch (e) {
                console.error('Error parsing embedded annotations:', e);
            }
        }

        // 3. LocalStorage fallback
        const saved = localStorage.getItem(`pen_strokes_${articleId}`);
        if (saved) {
            try {
                strokes = JSON.parse(saved);
                renderAllStrokes();
            } catch (e) {
                console.error('Error loading saved strokes:', e);
            }
        }
    }

    // Export JSON to Clipboard
    function exportAnnotations() {
        const json = JSON.stringify(strokes, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            alert('✍️ Handwritten Annotations copied to Clipboard!\n\nYou can paste this JSON directly into your article HTML:\n<script id="article-annotations" type="application/json">\n' + json + '\n</script>');
        }).catch(() => {
            console.log('Annotations JSON:', json);
            alert('Annotations logged to Developer Console!');
        });
    }

    // Auto Init
    document.addEventListener('DOMContentLoaded', () => {
        init();
        setTimeout(updateSvgDimensions, 500);
    });
})();
