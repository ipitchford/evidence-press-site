#!/usr/bin/env node
'use strict';
// MIT generator; original schematic CC0-1.0. No numerical or architectural claim.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const site = root;
const {assign, palettes} = require(path.join(site, 'tools/banner-palettes'));
// Article art is outside the paper-art validator. Preserve the paper registry;
// record the proposed next allocation with the article handoff for reconciliation.
const registry = JSON.parse(fs.readFileSync(path.join(site,'data/BANNER_PALETTES.json')));
const assignmentPath=path.join(root,'articles/a-better-learner/art-palette.json');
const name=fs.existsSync(assignmentPath)?JSON.parse(fs.readFileSync(assignmentPath)).palette:assign(registry,'a-better-learner');
const [bg1,bg2] = palettes[name];
const ivory='#fff9ed', gold='#efbe65', aqua='#71d5d0', muted='#d4ccd9';
const label=(x,y,s,size=48,fill=ivory)=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" text-anchor="middle">${s}</text>`;
const squares=Array.from({length:16},(_,i)=>{
 const col=i%4,row=Math.floor(i/4),active=[1,5,6,10,14].includes(i);
 return `<rect x="${521+col*40}" y="${134+row*34}" width="30" height="24" rx="5" fill="${active?gold:ivory}" opacity="${active?.95:.2}"/>`;
}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-labelledby="title desc" data-banner-palette="${name}">
<title id="title">Train for useful decisions after new experience</title>
<desc id="desc">Schematic: evidence changes adaptive state, then influences later decisions. Outer training rewards usefulness on later examples, as in RL squared and MAML. No SSI architecture or measured result is depicted.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="${aqua}" stroke-width="1.8"/></marker></defs>
<rect width="1200" height="400" fill="url(#bg)"/>
<g font-family="Arial,Helvetica,sans-serif">
${label(220,65,'New evidence',45)}${label(600,65,'Adaptive state',45)}${label(980,65,'Later decisions',45)}
<g stroke="${ivory}" stroke-width="3" fill="none" opacity=".8"><rect x="142" y="133" width="112" height="122" rx="10" transform="rotate(-9 198 194)"/><rect x="161" y="118" width="112" height="122" rx="10" fill="${bg2}"/><path d="M183 151H251M183 174H240M183 197H222"/></g>
<circle cx="256" cy="228" r="31" fill="${gold}"/><path d="M241 228L252 238L273 216" fill="none" stroke="${bg1}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M321 190H448" fill="none" stroke="${aqua}" stroke-width="4" marker-end="url(#arrow)"/><path d="M750 190H875" fill="none" stroke="${aqua}" stroke-width="4" marker-end="url(#arrow)"/>
<rect x="493" y="109" width="205" height="163" rx="20" fill="none" stroke="${gold}" stroke-width="3"/>${squares}
<g fill="none" stroke="${ivory}" stroke-width="3" opacity=".75"><path d="M932 157L975 125L1032 153M932 157L967 199L1032 153M967 199L1020 244"/></g>
<circle cx="932" cy="157" r="13" fill="${ivory}"/><circle cx="975" cy="125" r="13" fill="${ivory}"/><circle cx="1032" cy="153" r="13" fill="${ivory}"/>
<path d="M932 157L967 199L1020 244" fill="none" stroke="${aqua}" stroke-width="6"/>
<circle cx="967" cy="199" r="16" fill="${aqua}"/><circle cx="1020" cy="244" r="16" fill="${aqua}"/>
<path d="M995 275C995 329 384 333 373 266" fill="none" stroke="${aqua}" stroke-width="3" marker-end="url(#arrow)"/>
${label(649,371,'Train for the later use of the lesson',37,muted)}
</g></svg>\n`;
const folder=path.join(root,'assets/articles');fs.mkdirSync(folder,{recursive:true});
fs.writeFileSync(path.join(folder,'a-better-learner-banner.svg'),svg);
fs.writeFileSync(assignmentPath,JSON.stringify({slug:'a-better-learner',palette:name,colors:[bg1,bg2],allocation:'Saved article allocation from the site palette resolver at publication.',reference:'cyclicity-support-fusion-atlas'},null,2)+'\n');
console.log(`Generated article schematic using ${name} palette.`);
