/* The page works as a linked essay library without JavaScript. YouTube is
   contacted only when a reader chooses to play a film or open its own link. */
'use strict';
(() => {
  const root = document.querySelector('[data-film-library]');
  if (!root) return;
  const episodes = JSON.parse(document.getElementById('wmb-film-data').textContent);
  const byId = id => document.getElementById(`wmb-${id}`);
  const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  let current = episodes[0];
  function play(start = 0) {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${current.youtubeId}?rel=0&start=${Math.floor(start)}`;
    frame.title = `${current.title} — Why Minds Break`;
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    byId('player').replaceChildren(frame);
    frame.focus();
  }
  function select(number, focus = false) {
    current = episodes.find(e => e.number === number) || episodes[0];
    const poster = document.createElement('a');
    poster.className = 'wmb-poster'; poster.href = current.youtubeUrl;
    poster.setAttribute('aria-label', `Play ${current.title}`); poster.dataset.play = '';
    const image = document.createElement('img'); image.src = current.poster; image.alt = ''; image.width = 1280; image.height = 720;
    const label = document.createElement('span'); label.className = 'wmb-play'; label.textContent = '▶ Play film';
    const duration = document.createElement('span'); duration.className = 'wmb-duration'; duration.textContent = time(current.duration);
    poster.append(image, label, duration); byId('player').replaceChildren(poster);
    byId('selection').textContent = `Episode ${String(current.number).padStart(2, '0')} · ${time(current.duration)}`;
    byId('title').textContent = current.title; byId('description').textContent = current.description;
    byId('essay').href = current.essayUrl; byId('youtube').href = current.youtubeUrl; byId('captions').href = current.captions;
    byId('chapters').replaceChildren(...current.chapters.map(c => {
      const a = document.createElement('a'); a.href = `${current.youtubeUrl}&t=${Math.floor(c.start)}s`; a.dataset.start = Math.floor(c.start);
      const clock = document.createElement('span'); clock.textContent = time(c.start); a.append(clock, ` ${c.title}`); return a;
    }));
    byId('transcript').replaceChildren(byId(`transcript-${current.number}`).content.cloneNode(true));
    root.querySelector('.wmb-transcript').open = false;
    root.querySelectorAll('[data-episode]').forEach(a => a.setAttribute('aria-current', String(Number(a.dataset.episode) === current.number)));
    if (focus) { byId('title').tabIndex = -1; byId('title').focus({ preventScroll: true }); byId('player').scrollIntoView({ block: 'start' }); }
  }
  root.addEventListener('click', event => {
    const target = event.target.closest('a');
    if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target.hasAttribute('data-play')) { event.preventDefault(); play(); }
    else if (target.hasAttribute('data-start')) { event.preventDefault(); play(Number(target.dataset.start)); }
    else if (target.hasAttribute('data-episode')) {
      event.preventDefault(); const number = Number(target.dataset.episode);
      if (location.hash !== `#episode-${number}`) history.pushState(null, '', `#episode-${number}`);
      select(number, true);
    }
  });
  const fromHash = () => select(Number(location.hash.match(/^#episode-(\d+)$/)?.[1]) || 1);
  window.addEventListener('hashchange', fromHash); window.addEventListener('popstate', fromHash); fromHash();
})();
