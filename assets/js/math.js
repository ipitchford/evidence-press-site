/* Evidence Press — KaTeX activation.
 *
 * Replaces an inline onload="…" attribute on the auto-render script, which a
 * Content-Security-Policy without 'unsafe-inline'/'unsafe-hashes' would block.
 * Loaded with defer after katex.min.js and auto-render.min.js, so it runs in
 * document order once both are parsed and before DOMContentLoaded fires.
 */
(function () {
  'use strict';

  function render() {
    if (typeof window.renderMathInElement !== 'function') return;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      /* A malformed expression should show as source text, not replace the
         page region with an exception. */
      throwOnError: false
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
