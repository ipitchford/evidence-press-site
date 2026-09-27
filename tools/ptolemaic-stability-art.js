'use strict';
// Exact objects and first-order coefficients from Theorem 2.1 and Proposition 7.2.
const label=(x,y,s,size=25,color='#edf5f0')=>`<text class="og-hide" x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${s}</text>`;
function cover(a,b){
 const A=[[100,120],[200,80],[300,120]],B=[[95,265],[170,310],[250,310],[325,265]];
 let s='';for(const [x,y]of A)for(const[u,v]of B)s+=`<path d="M${x} ${y} L${u} ${v}" stroke="${a}" stroke-width="2" opacity=".35"/>`;
 for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++)s+=`<path d="M${A[i][0]} ${A[i][1]} L${A[j][0]} ${A[j][1]}" stroke="${a}" stroke-width="3"/>`;
 for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++)s+=`<path d="M${B[i][0]} ${B[i][1]} L${B[j][0]} ${B[j][1]}" stroke="${b}" stroke-width="3" stroke-dasharray="7 6"/>`;
 for(const[x,y]of A)s+=`<circle cx="${x}" cy="${y}" r="9" fill="${a}"/>`;for(const[x,y]of B)s+=`<circle cx="${x}" cy="${y}" r="9" fill="${b}"/>`;
 s+=label(65,370,'CS(3,4): solid 1 · dashed 2',22);
 s+=label(465,76,'SHARP FIRST-ORDER RATES',24,a)+label(465,123,'Gap ÷ largest distance change',28);
 s+=`<path d="M490 220 H1100" stroke="#8aaba8" stroke-width="3"/><path d="M515 220 H1095" stroke="${a}" stroke-width="10"/><circle cx="515" cy="220" r="13" fill="${b}"/><circle cx="1095" cy="220" r="13" fill="${b}"/>`;
 s+=label(465,183,'2p / 21',27,b)+label(994,183,'16p / 7',27,b)+label(465,283,'Both endpoints attained',25)+label(465,330,'p = log₂(16/9) · mean cross-distance = 1',23);
 return s;
}
function rates(){const a='#61d9c0',b='#f0c274';return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 710" role="img" aria-labelledby="title"><title id="title">Seven-point linear rates and four-point quadratic behaviour</title><rect width="1000" height="710" rx="18" fill="#17292c"/>${label(50,65,'Seven points: a sharp range of linear rates',34)}${label(50,110,'Mean cross-distance 1; h is the largest distance change',24)}<path d="M80 220 H915" stroke="${a}" stroke-width="12"/><circle cx="80" cy="220" r="16" fill="${b}"/><circle cx="915" cy="220" r="16" fill="${b}"/>${label(50,182,'2p/21 ≈ 0.0791',29,b)}${label(670,182,'16p/7 ≈ 1.8973',29,b)}${label(50,280,'Attainable limiting values of Δₚ(d) / h',27,a)}${label(50,327,'CS(3,4), with p = log₂(16/9)',26)}<path d="M50 365 H950" stroke="#4d7275"/>${label(50,425,'Four points: a genuinely different regime',34)}${label(50,476,'Star arms 1+t, 1−t, 1; p = log₂3',27)}${label(50,535,'Δₚ(dₜ) = [p(2p−3)/8] t² + O(t⁴)',34,b)}${label(50,589,'No positive linear lower bound along this family.',26,a)}${label(50,657,'Exact asymptotic statements · not simulated finite-error curves',22)}</svg>`;}
module.exports={cover,rates};
