(()=>{
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const key='kf-enh';
const state=JSON.parse(localStorage.getItem(key)||'{}');
const save=()=>localStorage.setItem(key,JSON.stringify(state));
// 1. Persistent theme toggle
const theme=document.createElement('button');theme.className='enh-theme';theme.textContent=state.theme==='light'?'☀':'◐';theme.title='Сменить оформление';document.body.append(theme);
if(state.theme==='light')document.body.classList.add('light-mode');theme.onclick=()=>{state.theme=state.theme==='light'?'dark':'light';document.body.classList.toggle('light-mode',state.theme==='light');theme.textContent=state.theme==='light'?'☀':'◐';save()};
// 2. Reading progress
const bar=document.createElement('div');bar.className='read-progress';document.body.prepend(bar);addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h?scrollY/h*100:0)+'%'},{passive:true});
// 3. Back-to-top
const top=document.createElement('button');top.className='to-top';top.textContent='↑';top.title='Наверх';document.body.append(top);addEventListener('scroll',()=>top.classList.toggle('show',scrollY>500),{passive:true});top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
// 4. Random page / discovery
const links=$$('a[href$=".html"]');const pool=links.filter(a=>!a.href.includes(location.pathname.split('/').pop()||'index.html'));
if(pool.length){const b=document.createElement('button');b.className='random-btn';b.textContent='✦ СЛУЧАЙНО';b.onclick=()=>location.href=pool[Math.floor(Math.random()*pool.length)].href;document.body.append(b)}
// 5. Keyboard navigation
addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('menu-open');if(e.key.toLowerCase()==='r'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&pool.length)location.href=pool[Math.floor(Math.random()*pool.length)].href});
// 6. Visit streak / local fan level
state.visits=(state.visits||0)+1;state.last=Date.now();state.level=Math.min(10,Math.ceil(state.visits/3));save();
const badge=document.createElement('div');badge.className='fan-level';badge.innerHTML=`FAN LVL ${state.level}<small>${state.visits} заходов</small>`;document.body.append(badge);
// 7. Share current page
const share=document.createElement('button');share.className='share-fab';share.textContent='↗';share.title='Поделиться страницей';share.onclick=async()=>{try{await navigator.share({title:document.title,url:location.href})}catch{await navigator.clipboard?.writeText(location.href);share.textContent='✓';setTimeout(()=>share.textContent='↗',1200)}};document.body.append(share);
// 8. Reveal animations
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.08});$$('.section,.portal-card,.shot,.home-shot,.live-card').forEach(e=>{e.classList.add('reveal');io.observe(e)});
// 9. Double click/click logo returns home
const brand=$('.brand');if(brand)brand.addEventListener('dblclick',()=>location.href='index.html');
// 10. Online-friendly clock in footer
const foot=$('.footer');if(foot){const c=document.createElement('span');c.className='live-clock';foot.append(c);const tick=()=>c.textContent='KORZH FAN · '+new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'}).format(new Date());tick();setInterval(tick,30000)}
})();