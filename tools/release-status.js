'use strict';

// State is supplied by the renderer's canonical assuranceOf/assuranceState path.
// Only an explicit passed state licenses the positive replay claim.
function releaseStatusText(internalReplayState, surface = 'markdown') {
  const replay = internalReplayState === 'passed'
    ? 'internally replayed' : 'internal replay not claimed';
  if (surface === 'html')
    return `Unrefereed · ${replay}; awaiting independent verification`;
  if (surface === 'bibtex')
    return internalReplayState === 'passed'
      ? 'Unrefereed; internally replayed evidence package.'
      : 'Unrefereed; internal replay not claimed.';
  if (surface === 'jsonld')
    return `Unrefereed — ${internalReplayState === 'passed' ? 'internally replayed evidence' : replay}; not peer reviewed, not independently reproduced, not formally verified`;
  return `unrefereed (${replay}; not peer reviewed, not independently reproduced, not formally verified)`;
}

module.exports = { releaseStatusText };
