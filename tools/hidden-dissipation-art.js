'use strict';
// Exact ring topology; persistence windows are a conceptual schematic, not a sampled trajectory.
const description='A three-state ring is observed as one A state and two B states. The past and future uninterrupted-persistence tests have negative covariance at the target q=1/20. That yields a positive dissipation floor for every compatible finite hidden architecture; the lower bound is not the optimum.';
function cover(a,b){
 const ink='#f7f1e7',soft='#cfccd6';
 const tx=(x,y,text,size=22,c=ink,anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" fill="'+c+'" font-family="Georgia,serif" font-size="'+size+'">'+text+'</text>';
 let s='<g fill="none" stroke="'+a+'"><path d="M77 207 Q190 148 304 207 L323 316 Q192 368 60 316Z" stroke-opacity=".5" fill="'+a+'" fill-opacity=".055" stroke-width="2"/>';
 s+='<path d="M190 108 L84 283 L294 283Z" stroke-width="3.5"/></g>';
 for(const [x,y,label,c]of [[190,108,'A',b],[84,283,'B',a],[294,283,'B',a]])s+='<circle cx="'+x+'" cy="'+y+'" r="25" fill="#161c25" stroke="'+c+'" stroke-width="3"/>'+tx(x,y+8,label,25,c);
 s+=tx(190,44,'Hidden ring',27)+tx(190,367,'opposing rates 1 and 1/20',20,soft);
 s+='<path d="M345 195 H399 M389 187 L401 195 L389 203" fill="none" stroke="'+soft+'" stroke-width="2"/>';
 s+=tx(608,44,'Past meets future',27);
 s+='<path d="M430 192 H786" stroke="'+soft+'" stroke-opacity=".4"/><rect x="438" y="157" width="160" height="70" rx="8" fill="'+a+'" fill-opacity=".13"/><rect x="618" y="157" width="160" height="70" rx="8" fill="'+b+'" fill-opacity=".13"/><path d="M438 246 V259 H598 V246 M618 246 V259 H778 V246" fill="none" stroke="'+soft+'" stroke-width="2"/><circle cx="608" cy="192" r="9" fill="'+ink+'"/>';
 s+=tx(518,201,'past',26,a)+tx(698,201,'future',26,b)+tx(608,129,'uninterrupted residence in B',20,soft)+tx(518,287,'t = 0.3',20,soft)+tx(698,287,'t = 0.3',20,soft)+tx(608,350,'b &lt; a²',31,a);
 s+='<path d="M813 195 H851 M840 187 L852 195 L840 203" fill="none" stroke="'+soft+'" stroke-width="2"/>';
 s+=tx(1014,44,'No zero-cost escape',27);
 s+='<path d="M878 106 H1150 M878 306 H1150" stroke="'+a+'" stroke-opacity=".4" stroke-width="1.5"/>';
 s+=tx(1014,157,'Every compatible',23)+tx(1014,190,'finite architecture',23)+tx(1014,247,'cost &gt; 0.017568',32,b)+tx(1014,284,'certified lower bound',20,soft)+tx(1014,367,'not the optimal cost',20,soft);
 return s;
}
module.exports={cover,description};
