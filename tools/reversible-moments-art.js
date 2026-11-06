'use strict';
// Exact Theorem 2.1 extremiser: r=1/2, p=3. No simulated data.
// Brief: balanced signed means can coexist with sharp 4:1 cubic moments.
// Reference: cyclicity-support-fusion-atlas, a coherent sequence of objects.
const colors=['#f5d38c','#93d9d0'];
const description='Exact reversible two-state example. Values plus one and minus one half have stationary masses one third and two thirds. A positive state moves to the negative state with probability one. The negative state returns with probability one half and stays with probability one half. Positive and negative cubic moments are one third and one twelfth, shown by bars with heights four to one. This attains the theorem for r equal to one half and p equal to three; arrows are transition probabilities, not rates.';
function draw(){return `<defs><marker id="rm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#eee5d7" stroke-width="1.5"/></marker></defs>
<g font-family="Georgia,serif" fill="#f8f1e5">
<path d="M234 153 C300 70 420 70 486 153" fill="none" stroke="#eee5d7" stroke-width="3" marker-end="url(#rm-arrow)"/>
<path d="M486 233 C420 300 300 300 234 233" fill="none" stroke="#eee5d7" stroke-width="3" marker-end="url(#rm-arrow)"/>
<path d="M557 155 C648 81 680 250 574 219" fill="none" stroke="#eee5d7" stroke-width="3" marker-end="url(#rm-arrow)"/>
<text x="360" y="91" text-anchor="middle" font-size="36">1</text>
<text x="360" y="309" text-anchor="middle" font-size="36">½</text>
<text x="655" y="190" text-anchor="middle" font-size="36">½</text>
<circle cx="200" cy="193" r="61" fill="#f5d38c"/><circle cx="520" cy="193" r="61" fill="#93d9d0"/>
<text x="200" y="211" fill="#30271a" text-anchor="middle" font-size="58">+1</text>
<text x="520" y="211" fill="#173b38" text-anchor="middle" font-size="58">−½</text>
<text class="og-hide" x="200" y="351" text-anchor="middle" font-size="28" fill="#f5d38c">mass ⅓</text>
<text class="og-hide" x="520" y="351" text-anchor="middle" font-size="28" fill="#93d9d0">mass ⅔</text>
<path d="M725 193 H778" stroke="#eee5d7" stroke-opacity=".5" stroke-width="2" marker-end="url(#rm-arrow)"/>
<text x="982" y="62" text-anchor="middle" font-size="30">cubic moments</text>
<path d="M831 296 H1133" stroke="#eee5d7" stroke-opacity=".45" stroke-width="2"/>
<rect x="871" y="120" width="72" height="176" fill="#f5d38c"/>
<rect x="1021" y="252" width="72" height="44" fill="#93d9d0"/>
<text x="907" y="104" text-anchor="middle" font-size="33" fill="#f5d38c">⅓</text>
<text x="1057" y="237" text-anchor="middle" font-size="33" fill="#93d9d0">1⁄12</text>
<text x="982" y="359" text-anchor="middle" font-size="46">4 : 1</text>
</g>`;}
function thumbnailHero(){return `<svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Positive and negative cubic moments, ratio four to one"><path d="M65 210 H445" stroke="#fff1db" stroke-opacity=".5" stroke-width="2"/><rect x="110" y="34" width="100" height="176" fill="#f5d38c"/><rect x="295" y="166" width="100" height="44" fill="#93d9d0"/><text x="160" y="253" text-anchor="middle" fill="#f5d38c" font-size="36">positive</text><text x="345" y="253" text-anchor="middle" fill="#93d9d0" font-size="36">negative</text><text x="345" y="100" text-anchor="middle" fill="#fff1db" font-size="57">4 : 1</text></svg><div class="note">An exact two-state example.<br>Balanced mean. Unequal cubic moments.</div>`;}
module.exports={draw,colors,description,thumbnailHero};
