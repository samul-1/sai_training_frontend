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
