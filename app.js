let selectedWhen='all',selectedTopic='all',cards=[],map=null,markers=[];

function applyFilters(){
  cards.forEach(c=>{
    const timeOK=selectedWhen==='all'||c.dataset.when===selectedWhen;
    const topicOK=selectedTopic==='all'||(c.dataset.tags||'').split(' ').includes(selectedTopic);
    c.classList.toggle('hidden',!(timeOK&&topicOK));
  });
}

function bindFilters(){
  document.querySelectorAll('.when-filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.when-filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); selectedWhen=btn.dataset.filter; applyFilters();
  }));
  document.querySelectorAll('.topic').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.topic').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); selectedTopic=btn.dataset.topic; applyFilters();
  }));
}

function initMap(){
  map=L.map('map',{scrollWheelZoom:false}).setView([49.92,14.0],8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  cards.forEach(c=>{
    const lat=+c.dataset.lat,lng=+c.dataset.lng;
    if(!Number.isFinite(lat)||!Number.isFinite(lng)) return;
    markers.push(L.marker([lat,lng]).addTo(map).bindPopup('<b>'+c.dataset.title+'</b>'));
  });
  if(markers.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(.14));
}

async function loadCards(){
  const target=document.getElementById('cards');
  try{
    const r=await fetch('cards.html',{cache:'no-cache'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    target.innerHTML=await r.text();
    cards=[...target.querySelectorAll('.card')];
    bindFilters(); applyFilters(); initMap();
  }catch(e){
    target.innerHTML='<div class="loading">Tipy se teď nepodařilo načíst. Zkus stránku obnovit.</div>';
    console.error(e);
  }
}

loadCards();