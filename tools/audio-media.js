'use strict';

// Index only the briefing the renderer actually found, preserving authored media.
function sameAudioAsset(left, right) {
  try {
    const a = new URL(left);
    const b = new URL(right);
    return a.origin === b.origin && a.pathname === b.pathname;
  } catch { return false; }
}

function withBriefingAudio(media, audioUrl, transcriptUrl) {
  const records = media || [];
  if (!audioUrl || records.some(item => item.type === 'audio' && !item.superseded && sameAudioAsset(item.url, audioUrl))) return records;
  return [...records, {
    type: 'audio', url: audioUrl, name: 'Plain-English audio briefing',
    description: 'Communication aid; not additional research evidence.',
    ...(transcriptUrl ? { transcriptUrl } : {})
  }];
}

module.exports = { sameAudioAsset, withBriefingAudio };
