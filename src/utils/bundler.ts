import { VirtualFile } from '../types';

/**
 * Bundles the virtual files into a self-contained HTML page
 * that can be safely loaded into a sandboxed iframe.
 */
export function buildPreviewHtml(files: VirtualFile[]): string {
  const htmlFile = files.find((f) => f.path === 'index.html' || f.path.endsWith('.html'));
  const jsFiles = files.filter((f) => f.path.endsWith('.js') || f.path.endsWith('.ts') || f.path.endsWith('.jsx') || f.path.endsWith('.tsx'));
  const cssFiles = files.filter((f) => f.path.endsWith('.css'));

  let baseHtml = htmlFile?.content || `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-900 text-white p-6">
    <div id="app"></div>
  </body>
</html>`;

  // Inject console interceptor script to capture logs in parent window
  const consoleScript = `
    <script>
      (function() {
        const sendLog = (level, args) => {
          try {
            window.parent.postMessage({
              type: 'PREVIEW_CONSOLE_LOG',
              level: level,
              message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
            }, '*');
          } catch(e){}
        };
        const origLog = console.log;
        const origWarn = console.warn;
        const origError = console.error;
        console.log = function(...args) { origLog.apply(console, args); sendLog('log', args); };
        console.warn = function(...args) { origWarn.apply(console, args); sendLog('warn', args); };
        console.error = function(...args) { origError.apply(console, args); sendLog('error', args); };
        window.onerror = function(msg, url, line) {
          sendLog('error', ['Error: ' + msg + ' (Line ' + line + ')']);
        };
      })();
    </script>
  `;

  // Inject user CSS
  const stylesBlock = cssFiles.map((f) => `<style id="file-${f.path.replace(/[^a-zA-Z0-9]/g, '-')}">\n${f.content}\n</style>`).join('\n');

  // Inject JS/TS script
  // If files include src/main.js or src/App.tsx, bundle them
  let scriptBlock = '';
  const mainJs = jsFiles.find((f) => f.path === 'src/main.js' || f.path === 'src/index.js' || f.path === 'main.js');
  if (mainJs) {
    // Strip simple TS types / export statements if any
    const sanitizedJs = mainJs.content
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '// import removed for browser bundle')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '');

    scriptBlock = `<script type="module">\n${sanitizedJs}\n</script>`;
  }

  // Insert console interceptor before closing </head> or at start
  if (baseHtml.includes('</head>')) {
    baseHtml = baseHtml.replace('</head>', `${consoleScript}\n${stylesBlock}\n</head>`);
  } else {
    baseHtml = consoleScript + stylesBlock + baseHtml;
  }

  // Insert scripts before closing </body> or at end
  if (scriptBlock) {
    if (baseHtml.includes('</body>')) {
      baseHtml = baseHtml.replace('</body>', `${scriptBlock}\n</body>`);
    } else {
      baseHtml = baseHtml + scriptBlock;
    }
  }

  return baseHtml;
}
