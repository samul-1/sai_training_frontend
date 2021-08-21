"use strict";
exports.__esModule = true;
exports.renderTex = void 0;
function renderTex() {
    setTimeout(function () {
        return window.MathJax.Hub.Queue([
            'Typeset',
            window.MathJax.Hub,
        ]);
    }, 10);
}
exports.renderTex = renderTex;
