"use strict";
exports.__esModule = true;
exports.wrapInBackTicks = exports.codify = exports.highlightCode = exports.renderTex = void 0;
function renderTex() {
    setTimeout(function () {
        return window.MathJax.Hub.Queue([
            'Typeset',
            window.MathJax.Hub,
        ]);
    }, 10);
}
exports.renderTex = renderTex;
// utility function to replace `'s and ```'s with markup to highlight code (inline or
// on their respective block)
function highlightCode(text) {
    var _a;
    return (_a = text === null || text === void 0 ? void 0 : text.replace(/```([^`]*)```/g, function (match, code) {
        return ("\n        <div class=\"p-2 my-1 text-xs text-white break-all bg-gray-800 rounded-md shadow-sm -mono\"><pre style=\"padding: 0.25rem\" class=\" language-javascript\"><code class=\" language-javascript\">" +
            code.replace(/<p>/g, '').replace(/(?!^)<\/p>/g, '\n') +
            "</code></pre>\n        </div>\n      ");
    })) === null || _a === void 0 ? void 0 : _a.replace(/`([^`]*)`/g, "\n    <div\n    class=\"inline-block p-1 font-mono text-xs text-white break-all bg-gray-800 rounded-md shadow-sm\"\n    >\n      <pre style=\"line-height: 0.95; overflow-y: hidden\" class=\" language-javascript\"><code style=\"line-height: 0.5\" class=\" language-javascript\">$1</code></pre>\n    </div>\n  ");
}
exports.highlightCode = highlightCode;
// wraps passed string into divs with code highlight classes
function codify(text) {
    return "\n  <div\n  class=\"w-full inline-block px-1 font-mono text-xs text-white break-all bg-gray-800 rounded-md shadow-sm\"\n  >\n    <pre style=\"line-height: 0.1; overflow-y: hidden; padding: 0.25rem\" class=\" language-javascript\"><code style=\"line-height: 0.5\" class=\" language-javascript\">" + text + "</code></pre>\n  </div>\n";
}
exports.codify = codify;
function wrapInBackTicks(text) {
    return '```' + text + '```';
}
exports.wrapInBackTicks = wrapInBackTicks;
