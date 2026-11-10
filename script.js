/* Portfolio enhancement: mobile menu, accessible navigation and scroll reveals. */
(() => {
  'use strict';
  const sections=[...document.querySelectorAll('main section[id]')];
  const dots=document.getElementById('section-dots');
  const menu=document.getElementById('menu-button');
  const nav=document.getElementById('main-nav');
  const progress=document.getElementById('scroll-progress');
  const year=document.getElementById('year');
  if(year)year.textContent=String(new Date().getFullYear());
  const observerSupported='IntersectionObserver' in window;
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(observerSupported&&!reduceMotion){
    document.documentElement.classList.add('js-reveal');
    const observer=new IntersectionObserver((entries,self)=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');self.unobserve(entry.target);}});
    },{threshold:0.08,rootMargin:'0px 0px 35px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
  if(dots){
    sections.forEach(s=>{
      const a=document.createElement('a');a.href='#'+s.id;
      const title=s.dataset.title||s.id;
      a.setAttribute('aria-label','Go to '+title);a.title=title;dots.appendChild(a);
    });
    if(observerSupported){
      const links=[...dots.querySelectorAll('a')];
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{if(!entry.isIntersecting)return;const i=sections.indexOf(entry.target);
          links.forEach((a,j)=>{a.classList.toggle('active',i===j);if(i===j)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
        });
      },{threshold:.35});sections.forEach(s=>observer.observe(s));
    }
  }
  let scheduled=false;
  function onScroll(){
    if(scheduled||!progress)return;scheduled=true;
    requestAnimationFrame(()=>{
      const root=document.documentElement,max=Math.max(0,root.scrollHeight-root.clientHeight);
      progress.style.width=(max?Math.min(100,root.scrollTop/max*100):0)+'%';scheduled=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  onScroll();
  if(menu&&nav){
    const setOpen=open=>{
      nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
    };
    setOpen(false);
    menu.addEventListener('click',()=>setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
    document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))setOpen(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setOpen(false);menu.focus();}});
    window.addEventListener('resize',()=>{if(innerWidth>700)setOpen(false);},{passive:true});
  }
})();
