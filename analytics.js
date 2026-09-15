(function(){
  const KEY='korzhEvents';
  const SESSION_KEY='korzhSessionId';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function localEvent(type,extra){const x=read();x.push(Object.assign({type,page:location.pathname,time:new Date().toLocaleString('ru-RU')},extra||{}));localStorage.setItem(KEY,JSON.stringify(x.slice(-1000)))}
  function sessionId(){let id=sessionStorage.getItem(SESSION_KEY);if(!id){id=crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now();sessionStorage.setItem(SESSION_KEY,id)}return id}
  async function remoteEvent(type,extra){
    const client=window.korzhSupabase;
    if(!client)return;
    try{await client.from('analytics_events').insert({event_type:type,page:location.pathname,session_id:sessionId(),metadata:extra||{}})}catch(e){}
  }
  function event(type,extra){localEvent(type,extra);remoteEvent(type,extra)}
  event('page_view');
  document.addEventListener('click',function(e){const el=e.target.closest('[data-track]');if(el)event(el.dataset.track,{label:(el.textContent||'').trim().slice(0,80)})});
  window.korzhTrack=event;
})();