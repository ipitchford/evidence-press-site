export const STORAGE_KEY = 'evidence-press-learning-atlas-v1';
export const emptyState = () => ({version:1,watchLater:[],liked:[],hidden:[],watched:[],opened:[],playlists:[],pathProgress:{},theme:'system'});
const validId = value => typeof value === 'string' && value.length > 0 && value.length <= 180 && !/[<>\u0000-\u001f]/.test(value);
export function validateState(input) {
  if (!input || typeof input !== 'object' || input.version !== 1) throw new Error('This is not a supported atlas library export.');
  const result = emptyState();
  for (const key of ['watchLater','liked','hidden','watched','opened']) {
    if (!Array.isArray(input[key]) || input[key].length > 20000 || !input[key].every(validId)) throw new Error(`Invalid ${key} list.`);
    result[key] = [...new Set(input[key])];
  }
  if (!Array.isArray(input.playlists) || input.playlists.length > 200) throw new Error('Invalid playlists.');
  result.playlists = input.playlists.map(p => {
    if (!validId(p.id) || typeof p.name !== 'string' || !p.name.trim() || p.name.length > 120 || !Array.isArray(p.ids) || p.ids.length > 10000 || !p.ids.every(validId)) throw new Error('Invalid playlist.');
    return {id:p.id,name:p.name,ids:[...new Set(p.ids)]};
  });
  if (!input.pathProgress || typeof input.pathProgress !== 'object' || Array.isArray(input.pathProgress)) throw new Error('Invalid path progress.');
  for (const [key, ids] of Object.entries(input.pathProgress)) {
    if (!validId(key) || ['__proto__','constructor','prototype'].includes(key) || !Array.isArray(ids) || ids.length > 100 || !ids.every(validId)) throw new Error('Invalid path progress.');
    result.pathProgress[key] = [...new Set(ids)];
  }
  if (['system','light','dark'].includes(input.theme)) result.theme = input.theme;
  return result;
}
export function readState(storage) { try { const raw = storage.getItem(STORAGE_KEY); return raw ? validateState(JSON.parse(raw)) : emptyState(); } catch { return emptyState(); } }
export function saveState(storage, state) { const checked = validateState(state); storage.setItem(STORAGE_KEY, JSON.stringify(checked)); return checked; }
export function toggleItem(state, key, id) {
  if (!['watchLater','liked','hidden','watched','opened'].includes(key) || !validId(id)) throw new Error('Invalid library action');
  return {...state,[key]:state[key].includes(id) ? state[key].filter(x=>x!==id) : [...state[key],id]};
}
export function mergeState(current, imported) {
  const a=validateState(current), b=validateState(imported), result={...a};
  for(const key of ['watchLater','liked','hidden','watched','opened']) result[key]=[...new Set([...a[key],...b[key]])];
  result.playlists=[...a.playlists];
  for(const p of b.playlists) { const found=result.playlists.find(x=>x.id===p.id); if(found) found.ids=[...new Set([...found.ids,...p.ids])]; else result.playlists.push(p); }
  result.pathProgress={...a.pathProgress};
  for(const [key,ids] of Object.entries(b.pathProgress)) result.pathProgress[key]=[...new Set([...(a.pathProgress[key]??[]),...ids])];
  return validateState(result);
}
