'use strict';
const CC0='https://creativecommons.org/publicdomain/zero/1.0/';
function scope(p){if(p.licenseScope===undefined)return null;if(typeof p.licenseScope!=='string'||!p.licenseScope.trim()||Array.from(p.licenseScope).length>2000)throw new Error('licenseScope must be nonempty plain text of at most 2000 characters');return p.licenseScope;}
function fields(p){const s=scope(p);return s?{license:'LicenseRef-Component-Specific',licenseScope:s}:{license:'CC0-1.0'};}
function jsonld(p){const s=scope(p);return s?{'@type':'CreativeWork',name:'Component-specific licences',description:s}:CC0;}
function html(p,escape){const s=scope(p);return s?`Component-specific licences<p class="license-scope">${escape(s)}</p>`:`<a href="${CC0}" rel="noopener">CC0 1.0</a>`;}
function yaml(p){const s=scope(p);return s?`license: LicenseRef-Component-Specific\nlicenseScope: ${JSON.stringify(s)}`:'license: CC0-1.0';}
module.exports={scope,fields,jsonld,html,yaml};
