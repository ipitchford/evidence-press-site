'use strict';
// Source: manuscript attractor theorem and k >= 1000 max(1,mu^3).
// Surface is a schematic convex graph, not an orbit reconstruction.
exports.description='A schematic convex graph over a disk is paired with a logarithmic parameter map. Above the explicit large-gain boundary there is one attracting cycle; the intermediate region is unresolved outside local Hopf collars.';
exports.cover=(a,b)=>{
 const ink='#f5f1e8',dim='#c7c9d2';
 let s='<g font-family="Georgia,serif" fill="'+ink+'">';
 s+='<text x="275" y="43" text-anchor="middle" font-size="26">Three variables, planar dynamics</text>';
 const project=(x,y)=>[270+145*x+48*y,260+60*y-70*(x*x+y*y)];
 const curve=(f,n=100)=>Array.from({length:n+1},(_,i)=>{const [x,y]=f(i/n);return (i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);}).join(' ');
 // Convex paraboloid graph (screen height reverses mathematical height).
 for(let v=-.8;v<=.8001;v+=.2){const q=Math.sqrt(1-v*v);s+='<path d="'+curve(t=>project(v,-q+2*q*t))+'" fill="none" stroke="'+a+'" stroke-width="1.5" opacity=".35"/>';s+='<path d="'+curve(t=>project(-q+2*q*t,v))+'" fill="none" stroke="'+a+'" stroke-width="1.5" opacity=".35"/>';}
 s+='<path d="'+curve(t=>project(Math.cos(t*2*Math.PI),Math.sin(t*2*Math.PI)))+' Z" fill="'+a+'" fill-opacity=".06" stroke="'+a+'" stroke-width="3.5"/>';
 s+='<ellipse cx="270" cy="313" rx="160" ry="33" fill="none" stroke="'+dim+'" stroke-width="1.4" stroke-dasharray="5 6" opacity=".55"/>';
 for(const x of [-1,1]){let p=project(x,0);s+='<path d="M'+p[0]+' '+p[1]+' V313" stroke="'+dim+'" opacity=".3" stroke-dasharray="4 5"/>';}
 s+='<circle cx="270" cy="260" r="5" fill="'+b+'"/><text x="285" y="280" font-size="19" fill="'+b+'">E</text>';
 s+='<text x="270" y="100" text-anchor="middle" font-size="22" fill="'+a+'">convex-function graph</text><text x="270" y="366" text-anchor="middle" font-size="20" fill="'+dim+'">disk domain only above Hopf · schematic</text>';
 s+='<path d="M510 200 H570 M558 189 L570 200 L558 211" fill="none" stroke="'+dim+'" stroke-width="2" opacity=".6"/>';
 const X=u=>665+210*(Math.log10(u)+1),Y=k=>315-31*Math.log10(k/.05);
 const points=fn=>Array.from({length:101},(_,i)=>{let u=10**(-1+i/50);return [X(u),Y(fn(u))];});
 const path=pts=>pts.map((p,i)=>(i?'L':'M')+p.map(x=>x.toFixed(2)).join(' ')).join(' ');
 const high=points(u=>1000*Math.max(1,u**3)),hopf=points(u=>u*(1+u));
 s+='<path d="'+path([[665,62],[1085,62],...high.slice().reverse()])+'Z" fill="'+a+'" opacity=".14"/>';
 s+='<path d="'+path([...high,...hopf.slice().reverse()])+'Z" fill="'+b+'" opacity=".07"/>';
 s+='<path d="M650 58 V320 H1100" fill="none" stroke="'+dim+'" opacity=".55"/>';
 s+='<path d="'+path(high)+'" fill="none" stroke="'+a+'" stroke-width="3"/><path d="'+path(hopf)+'" fill="none" stroke="'+b+'" stroke-width="2"/>';
 s+='<text x="865" y="38" text-anchor="middle" font-size="26">An explicit uniqueness region</text><text x="720" y="91" font-size="24" fill="'+a+'">one attracting cycle</text><text x="708" y="229" font-size="24" fill="'+b+'">intermediate region open*</text><text x="900" y="302" font-size="19" fill="'+dim+'">equilibrium</text>';
 for(const u of [.1,1,10])s+='<text x="'+X(u)+'" y="341" text-anchor="middle" font-size="18" fill="'+dim+'">'+u+'</text>';
 s+='<text x="1110" y="323" font-size="22">μ</text><text x="630" y="63" font-size="22">k</text><text x="870" y="373" text-anchor="middle" font-size="22">k ≥ 1000 max(1, μ³)</text>';
 s+='<text x="870" y="393" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="'+dim+'">log axes · *excluding nonexplicit Hopf collars</text></g>';
 // Preserve the exact diagram on the page; suppress cropped labels behind OG text.
 return s.replace(/<text /g,'<text class="og-hide" ');
};
exports.thumbnailHero=()=>'<div style="font:700 48px Georgia;color:#fff;text-align:center">One attracting rhythm</div><div style="font:36px Georgia;color:#facc15;text-align:center;margin-top:35px">k ≥ 1000 max(1, μ³)</div><div style="font:23px Arial;color:#eee;text-align:center;margin-top:35px">The intermediate region remains open</div>';
