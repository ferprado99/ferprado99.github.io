
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

/* Modal de foto completa: independiente del zoom al pasar el cursor */
(function(){
 var overlay=document.createElement('div');
 overlay.className='interface-modal';
 overlay.hidden=true;
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','Fotografía ampliada de la interfaz');
 var panel=document.createElement('div');
 panel.className='interface-modal-panel';
 var photo=document.createElement('img');
 photo.alt='';
 var close=document.createElement('button');
 close.type='button';
 close.className='interface-modal-close';
 close.textContent='×';
 close.setAttribute('aria-label','Cerrar fotografía ampliada');
 var previous=document.createElement('button');
 previous.type='button';previous.className='interface-modal-arrow previous';previous.textContent='‹';
 previous.setAttribute('aria-label','Foto anterior');
 var next=document.createElement('button');
 next.type='button';next.className='interface-modal-arrow next';next.textContent='›';
 next.setAttribute('aria-label','Foto siguiente');
 panel.appendChild(photo);
 panel.appendChild(previous);
 panel.appendChild(next);
 panel.appendChild(close);
 overlay.appendChild(panel);
 document.body.appendChild(overlay);
 var lastFocus=null,modalImages=[],modalIndex=0;
 function displayPhoto(){var image=modalImages[modalIndex];if(!image)return;photo.src=image.src;photo.alt=image.alt||'Fotografía ampliada de interfaz de audio';}
 function movePhoto(delta){if(!modalImages.length)return;modalIndex=(modalIndex+delta+modalImages.length)%modalImages.length;displayPhoto();}
 previous.addEventListener('click',function(){movePhoto(-1)});
 next.addEventListener('click',function(){movePhoto(1)});
 function hide(){
  if(overlay.hidden)return;
  overlay.hidden=true;
  document.body.classList.remove('interface-modal-open');
  photo.removeAttribute('src');
  if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
 }
 function show(images,index,trigger){
  lastFocus=trigger;
  modalImages=images;
  modalIndex=index;
  displayPhoto();
  overlay.hidden=false;
  document.body.classList.add('interface-modal-open');
  close.focus({preventScroll:true});
 }
 document.querySelectorAll('.interfaces-section .carousel .vp').forEach(function(vp){
  vp.addEventListener('click',function(){
   var current=vp.querySelector('.track .slide img');
   var track=vp.querySelector('.track');
   if(track){
    var transform=track.style.transform||'';
    var match=transform.match(/translateX\(-?(\d+)%\)/);
    var index=match?Math.abs(parseInt(match[1],10))/100:1;
    var slides=track.querySelectorAll('.slide');
    if(slides[index]&&slides[index].querySelector('img'))current=slides[index].querySelector('img');
   }
   if(current){
    var originals=Array.prototype.map.call(track.querySelectorAll('.slide img'),function(im){return {src:im.currentSrc||im.src,alt:im.alt};}).slice(1,-1);
    var selected=originals.findIndex(function(im){return im.src===(current.currentSrc||current.src)});
    show(originals,Math.max(0,selected),vp);
   }
  });
  vp.setAttribute('tabindex','0');
  vp.setAttribute('role','button');
  vp.setAttribute('aria-label','Ampliar fotografía de interfaz');
  vp.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();vp.click()}});
 });
 close.addEventListener('click',hide);
 overlay.addEventListener('click',function(e){if(e.target===overlay)hide()});
 document.addEventListener('keydown',function(e){
  if(overlay.hidden)return;
  if(e.key==='Escape')hide();
  else if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1)}
  else if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1)}
 });
})();
