(function(){
  const KEY='korzhEvents';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function event(type,extra){const x=read();x.push(Object.assign({type,page:location.pathname,time:new Date().toLocaleString('ru-RU')},extra||{}));localStorage.setItem(KEY,JSON.stringify(x.slice(-1000)))}
  event('page_view');
  document.addEventListener('click',function(e){const el=e.target.closest('[data-track]');if(el)event(el.dataset.track);});
})();