export function renderTex(): void {
  setTimeout(
    () =>
      (<any>window).MathJax.Hub.Queue([
        'Typeset',
        (<any>window).MathJax.Hub,
      ]),
    10
  );
}

// utility function to replace `'s and ```'s with markup to highlight code (inline or
// on their respective block)
export function highlightCode(text: string): string {
  return text
    ?.replace(/```([^`]*)```/g, function (match, code) {
      return (
        `
        <div class="p-2 my-1 text-xs text-white break-all bg-gray-800 rounded-md shadow-sm -mono"><pre class=" language-javascript"><code class=" language-javascript">` +
        code.replace(/<p>/g, '').replace(/(?!^)<\/p>/g, '\n') +
        `</code></pre>
        </div>
      `
      );
    })
    ?.replace(
      /`([^`]*)`/g,
      `
    <div
    class="inline-block p-1 font-mono text-xs text-white break-all bg-gray-800 rounded-md shadow-sm"
    >
      <pre style="line-height: 0.95; overflow-y: hidden" class=" language-javascript"><code style="line-height: 0.5" class=" language-javascript">$1</code></pre>
    </div>
  `
    );
}
