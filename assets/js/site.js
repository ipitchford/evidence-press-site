/* Evidence Press — progressive enhancements.
 *
 * Deferred on every page; each block is a no-op when its markup is absent.
 * This lives in a file rather than a <script> block so the site can serve a
 * Content-Security-Policy without 'unsafe-inline'.
 */
(function () {
  'use strict';

  /* Visitors arriving on a legacy hostname are moved to the canonical domain
     with their path intact. Pages' _redirects cannot express host-scoped
     rules and pages.dev traffic never crosses our zone, so a server-side 301
     is not available for it; this is the supported mechanism. Deployment
     previews (<hash>.evidence-press.pages.dev) are left alone so a specific
     deployment stays inspectable, and machine clients fetching JSON are
     unaffected because they do not execute scripts — the JSON itself carries
     canonical URLs. */
  var canonicalHost = 'evidencepress.org';
  var host = window.location.hostname;
  if (host === 'evidence-press.pages.dev' || host === 'www.' + canonicalHost) {
    window.location.replace('https://' + canonicalHost +
      window.location.pathname + window.location.search + window.location.hash);
    return;
  }

  /* One polite live region, created lazily, for state that would otherwise be
     conveyed only visually: copy confirmations, filter counts, media errors. */
  var announcer = null;
  function announce(message) {
    if (!announcer) {
      announcer = document.createElement('p');
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  /* ------------------------------------------------------------ copy buttons */
  function selectContents(node) {
    try {
      var range = document.createRange();
      range.selectNodeContents(node);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    } catch (e) {
      return false;
    }
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    var targetId = button.getAttribute('data-copy');
    var original = button.textContent;

    button.addEventListener('click', function () {
      var target = document.getElementById(targetId);
      if (!target) return;

      var settle = function (label, message) {
        button.textContent = label;
        announce(message);
        window.setTimeout(function () { button.textContent = original; }, 2400);
      };

      /* A failure must never read as success. Select the text so it can still
         be copied by hand, and say what happened. */
      var failed = function () {
        var selected = selectContents(target);
        settle('Copy failed', selected
          ? 'Copy failed. The text is selected — use your copy shortcut.'
          : 'Copy failed. Select the text manually to copy it.');
      };

      if (!navigator.clipboard || !navigator.clipboard.writeText) { failed(); return; }
      navigator.clipboard.writeText(target.innerText).then(function () {
        settle('Copied', 'Copied to the clipboard.');
      }, failed);
    });
  });

  /* ----------------------------------------------------------- audio players */
  document.querySelectorAll('.play[data-audio]').forEach(function (button) {
    var audio = document.getElementById(button.getAttribute('data-audio'));
    if (!audio) return;

    var PLAY = '▶';
    var PAUSE = '❚❚';

    /* The control follows the media element's own events rather than assuming
       the click succeeded: playback can be refused, stall, or fail to load. */
    function reflect() {
      var playing = !audio.paused && !audio.ended;
      button.textContent = playing ? PAUSE : PLAY;
      button.setAttribute('aria-pressed', playing ? 'true' : 'false');
      button.setAttribute('aria-label', playing
        ? 'Pause the audio briefing'
        : 'Play the audio briefing');
    }

    ['play', 'playing', 'pause', 'ended'].forEach(function (name) {
      audio.addEventListener(name, reflect);
    });
    audio.addEventListener('error', function () {
      reflect();
      announce('The audio briefing could not be loaded. The transcript has the same content.');
    });

    button.addEventListener('click', function () {
      if (audio.paused || audio.ended) {
        var started = audio.play();
        if (started && typeof started.catch === 'function') {
          started.catch(function () {
            reflect();
            announce('The browser refused to start playback. The transcript has the same content.');
          });
        }
      } else {
        audio.pause();
      }
    });

    reflect();
  });

  /* ---------------------------------------------------------- release filter */
  (function () {
    var input = document.getElementById('filter');
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
    if (!cards.length) return;

    var total = cards.length;

    var status = document.createElement('p');
    status.className = 'filter-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    var clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'filter-clear';
    clear.textContent = 'Clear filter';
    clear.hidden = true;

    input.insertAdjacentElement('afterend', clear);
    (input.parentNode || document.body).appendChild(status);

    function apply(query, updateUrl) {
      var q = String(query || '').toLowerCase().trim();
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = card.textContent.toLowerCase() + ' ' +
          (card.getAttribute('data-keywords') || '');
        var match = !q || haystack.indexOf(q) !== -1;
        /* Both: [hidden] removes it from the accessibility tree, and the
           explicit display wins over the .card class rule that would
           otherwise override the UA stylesheet's [hidden] { display: none }. */
        card.hidden = !match;
        card.style.display = match ? '' : 'none';
        if (match) shown++;
      });

      clear.hidden = !q;
      if (!q) {
        status.textContent = 'Showing all ' + total + ' releases.';
      } else if (shown === 0) {
        status.textContent = 'No releases match “' + query.trim() +
          '”. Clear the filter to see all ' + total + '.';
      } else {
        status.textContent = 'Showing ' + shown + ' of ' + total +
          ' releases matching “' + query.trim() + '”.';
      }

      /* A filtered view should be linkable and bookmarkable. */
      if (updateUrl && window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        if (q) url.searchParams.set('q', query.trim());
        else url.searchParams.delete('q');
        window.history.replaceState(null, '', url);
      }
    }

    input.addEventListener('input', function () { apply(input.value, true); });
    clear.addEventListener('click', function () {
      input.value = '';
      apply('', true);
      input.focus();
    });

    var initial = new URL(window.location.href).searchParams.get('q');
    if (initial) {
      input.value = initial;
      apply(initial, false);
    }
  })();
})();
