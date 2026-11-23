export const SCHEMA_VERSION = 1;
export const LEVELS = ['foundation', 'intermediate', 'advanced', 'mixed', 'unknown'];
export const FORMATS = ['lecture', 'seminar', 'tutorial', 'interview', 'panel', 'documentary', 'demonstration', 'unknown'];
export const ACCESS_METHODS = ['authorised-api-metadata', 'official-media-range', 'official-player-metadata', 'browser-playback'];

export function safeURL(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; }
  catch { return null; }
}
export function canonicalVideo(value) {
  const safe = safeURL(value); if (!safe) throw new Error('A public HTTPS video URL is required');
  const u = new URL(safe); let id;
  if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(u.hostname)) {
    id = u.pathname === '/watch' ? u.searchParams.get('v') : /^\/(?:embed|shorts|live)\/([^/]+)/.exec(u.pathname)?.[1];
  } else if (u.hostname === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
  if (id !== undefined && id !== null) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Invalid YouTube video identifier');
    return { id: `youtube:${id}`, url: `https://www.youtube.com/watch?v=${id}`, delivery: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(u.hostname)) {
    id = /(?:^|\/)(\d+)(?:\/|$)/.exec(u.pathname)?.[1];
    if (id) return { id: `vimeo:${id}`, url: `https://vimeo.com/${id}`, delivery: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}?dnt=1` };
  }
  for (const key of [...u.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(key)) u.searchParams.delete(key);
  u.hash = ''; u.searchParams.sort();
  return { id: null, url: u.href, delivery: 'institution', embedUrl: null };
}
export const slugFor = id => String(id).replace(/[^a-zA-Z0-9_-]/g, '-');
export function resolveAlternateId(id, records) {
  const byId=records instanceof Map?records:new Map(records.map(r=>[r.id,r]));
  const seen=new Set();let current=id;
  while(true){
    if(seen.has(current))throw new Error(`Alternate upload cycle at ${current}`);
    seen.add(current);
    const record=byId.get(current);if(!record)throw new Error(`Missing alternate upload record: ${current}`);
    if(!record.alternateOf)return current;
    if(typeof record.alternateOf!=='string')throw new Error(`Invalid alternate parent for ${current}`);
    current=record.alternateOf;
  }
}
export function isDiscoverable(record) {
  return !record.withdrawn && !record.alternateOf && record.qualification?.status!=='excluded'
    && record.qualification?.sourceIdentityResolved!==false && record.qualification?.substanceResolved!==false
    && record.qualification?.distinctnessResolved!==false;
}
export function isQualified(record) {
  return record.qualification?.status === 'qualified' && record.availability?.status === 'accessible'
    && record.qualification.sourceIdentityResolved !== false && record.qualification.substanceResolved !== false
    && record.qualification.distinctnessResolved !== false
    && !record.availability.auditOnly && record.availability.permitted !== false
    && ACCESS_METHODS.includes(record.availability.method) && Boolean(record.availability.checkedAt)
    && Boolean(record.availability.evidence?.length) && !record.withdrawn && !record.alternateOf;
}
export function durationLabel(seconds) {
  if (seconds === null || seconds === undefined) return 'Duration unknown';
  const m = Math.round(seconds / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}`;
}
export function viewingTime(records) {
  const known = records.filter(r => Number.isFinite(r.durationSeconds) && r.durationEvidence?.length);
  return { seconds: known.reduce((n, r) => n + r.durationSeconds, 0), known: known.length, unknown: records.length - known.length };
}
export function positiveMentions(mentions) {
  const positive = mentions.filter(m => ['rec', 'strong_rec'].includes(m.stance));
  return { positive: positive.length, independent: positive.filter(m => m.selfPromotion === false && m.independenceChecked === true).length,
    uniqueContributors: new Set(positive.map(m => m.author).filter(Boolean)).size, retained: mentions.length };
}
export function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function markdownLink(label,url){
  const text=String(label??'').replace(/[\r\n]/g,' ').replace(/[\\\[\]]/g,'\\$&'),safe=safeURL(url);
  return safe?`[${text}](${safe.replaceAll('(','%28').replaceAll(')','%29')})`:text;
}
