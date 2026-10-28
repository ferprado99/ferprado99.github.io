
document.querySelectorAll('.carousel').forEach(function(c){
 var t=c.querySelector('.track'),vp=c.querySelector('.vp'),x=null,busy=false;
 var first=t.firstElementChild.cloneNode(true),last=t.lastElementChild.cloneNode(true);
 first.setAttribute('aria-hidden','true');last.setAttribute('aria-hidden','true');
 t.appendChild(first);t.insertBefore(last,t.firstChild);
 var n=t.children.length-2,i=1;
 function pos(k,anim){t.style.transition=anim?'transform .35s ease':'none';t.style.transform='translateX('+(-k*100)+'%)'}
 pos(i,false);
 function go(d){if(busy)return;busy=true;i+=d;pos(i,true);
  setTimeout(function(){if(i>n){i=1;pos(i,false)}else if(i<1){i=n;pos(i,false)}busy=false},370)}
 c.querySelector('.prev').addEventListener('click',function(){go(-1)});
 c.querySelector('.next').addEventListener('click',function(){go(1)});
 // Lupa tipo Mercado Libre: el recorte enseña píxeles originales (escala 1:1).
 var lens=document.createElement('div');lens.className='zoom-original';
 var large=document.createElement('img');large.alt='';lens.appendChild(large);vp.appendChild(lens);
 var zoomOn=false;
 function updateLens(e){
  if(!zoomOn)return;
  var active=t.children[i]&&t.children[i].querySelector('img');if(!active)return;
  if(large.src!==active.src)large.src=active.src;
  var r=vp.getBoundingClientRect(),w=vp.clientWidth,h=vp.clientHeight;
  var nw=large.naturalWidth||active.naturalWidth,nh=large.naturalHeight||active.naturalHeight;
  if(!nw||!nh)return;
  var px=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  var py=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
  large.style.width=nw+'px';large.style.height=nh+'px';
  large.style.left=(nw>w?-(nw-w)*px:(w-nw)/2)+'px';
  large.style.top=(nh>h?-(nh-h)*py:(h-nh)/2)+'px';
 }
 vp.addEventListener('mouseenter',function(e){if(e.pointerType==='touch')return;zoomOn=true;vp.classList.add('zoom-active');updateLens(e)});
 vp.addEventListener('mousemove',updateLens);
 vp.addEventListener('mouseleave',function(){zoomOn=false;vp.classList.remove('zoom-active')});
 vp.addEventListener('touchstart',function(e){x=e.touches[0].clientX},{passive:true});
 vp.addEventListener('touchend',function(e){if(x===null)return;var d=e.changedTouches[0].clientX-x;if(Math.abs(d)>40)go(d<0?1:-1);x=null});
});
var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}})},{threshold:.14,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.card,.row').forEach(function(el){io.observe(el)});
