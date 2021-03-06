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
        <div class="p-2 my-1 text-xs text-white break-all bg-gray-800 rounded-md shadow-sm -mono"><pre style="padding: 0.25rem" class=" language-javascript"><code class=" language-javascript">` +
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
    class="inline-block p-1 font-mono text-xs mx-1 text-white break-all bg-gray-800 rounded-md shadow-sm"
    >
      <pre style="padding: 0 !important; margin: 0 !important; line-height: 0.95; overflow-y: hidden" class=" language-javascript"><code style="line-height: 0.5" class=" language-javascript">$1</code></pre>
    </div>
  `
    );
}

// wraps passed string into divs with code highlight classes
export function codify(text: string): string {
  return `
  <div
  class="w-full inline-block px-1 font-mono text-xs text-white break-all bg-gray-800 rounded-md"
  >
    <pre style="line-height: 0.1; overflow-y: hidden; padding: 0.5rem" class="rounded-md language-javascript"><code style="line-height: 0.5" class=" language-javascript">${text}</code></pre>
  </div>
`;
}

export function wrapInBackTicks(text: string): string {
  return '```' + text + '```';
}

export function downloadObjectAsJson(
  exportObj: unknown,
  exportName: string
): void {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj, undefined, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
