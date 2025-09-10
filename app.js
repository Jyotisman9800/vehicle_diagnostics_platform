// Lightweight SPA matching your screenshots
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

// Demo data
const data = {
  operators: [
    {id:4,name:'Zenfleet Solutions',code:'ZENFLEET-002',email:'support@zenfleet.io',contact:'+44-20-8946-0321',tz:'Europe/London',currency:'GBP'},
    {id:7,name:'abhishek',code:'123qw',email:'vishal922002@gmail.com',contact:'07780974308',tz:'Asia/Kolkata',currency:'USD'},
    {id:9,name:'shivam',code:'ABC001',email:'info@logisitck.com',contact:'09803175282',tz:'UTC',currency:'USD'}
  ],
  vehicle:{vin:'UAUZZZ8V5LA901234',id:5,battery:45,maxSpeed:64,avgRange:244.22,error:0,trip:1,distance:0},
};

// Router
const routes = {
  '/dashboard': renderFleetDashboard,
  '/fleet-operators': renderFleetOperators,
  '/fleet-operators/4': renderOperatorDetail,
  '/vehicle-dashboard': renderVehicleDashboard,
};

function setHeader(breadcrumb, subtitle){
  $('#breadcrumb').textContent = breadcrumb;
  $('#subtitle').textContent = subtitle || '';
}

function navigate(){
  const hash = location.hash.replace('#','') || '/dashboard';
  // Basic param match for operator detail
  if(hash.startsWith('/fleet-operators/') && routes['/fleet-operators/4']){
    routes['/fleet-operators/4']();
    markActive('/fleet-operators');
    return;
  }
  const fn = routes[hash] || routes['/dashboard'];
  fn();
  markActive(hash);
}

function markActive(path){
  $$('#sidebar .item').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href').slice(1)===path);
  });
}

// Views
function renderFleetDashboard(){
  setHeader('Fleet Dashboard','Real-time diagnostics and fleet management');
  $('#app').innerHTML = `
    <div class="row cols-2">
      <div class="panel">
        <h2>Fleet Summary</h2>
        <div class="kpi-grid">
          <div class="kpi purple"><div class="muted">Total Vehicles</div><div style="font-size:24px;font-weight:800">15</div></div>
          <div class="kpi green"><div class="muted">Online Vehicles</div><div style="font-size:24px;font-weight:800">0</div><div class="muted">0% of fleet</div></div>
          <div class="kpi red"><div class="muted">Critical Alerts</div><div style="font-size:24px;font-weight:800">0</div></div>
          <div class="kpi yellow"><div class="muted">Active Trips</div><div style="font-size:24px;font-weight:800">0</div><div class="muted">0 km today</div></div>
        </div>
      </div>
      <div class="panel">
        <h2>Vehicle Status</h2>
        <canvas id="donut" class="chart"></canvas>
        <div class="muted" style="margin-top:6px">Available • In Use • Maintenance • Offline</div>
      </div>
    </div>

    <div class="row cols-2" style="margin-top:12px">
      <div class="panel">
        <h2>Telemetry Overview</h2>
        <div class="kpi-grid" style="grid-template-columns:repeat(2,1fr)">
          <div class="kpi"><div class="muted">Avg Battery</div><div style="font-size:22px;font-weight:800">66%</div></div>
          <div class="kpi"><div class="muted">Avg Range</div><div style="font-size:22px;font-weight:800">369.6 km</div></div>
        </div>
      </div>
      <div class="panel">
        <h2>Alerts Panel</h2>
        <canvas id="alertsPie" class="chart"></canvas>
        <div class="muted" style="margin-top:6px">1 Critical, 8 Medium, 1 Low</div>
      </div>
    </div>
  `;
  drawDonut($('#donut'), [
    {value:9,color:'#22c55e'}, // Available
    {value:3,color:'#3b82f6'}, // In Use
    {value:2,color:'#f59e0b'}, // Maintenance
    {value:1,color:'#ef4444'}, // Offline
  ]);
  drawDonut($('#alertsPie'), [
    {value:1,color:'#ef4444'},
    {value:8,color:'#f59e0b'},
    {value:1,color:'#22c55e'},
  ]);
}

function renderFleetOperators(){
  setHeader('Fleet Operators','Manage and monitor your fleet operators');
  const rows = data.operators.map(o=>`
    <tr>
      <td><a href="#/fleet-operators/${o.id}">${o.name}</a></td>
      <td>${o.code}</td>
      <td>${o.email}</td>
      <td>${o.contact}</td>
      <td>${o.tz}</td>
      <td>${o.currency}</td>
      <td class="actions"><a href="#/fleet-operators/${o.id}">👁</a> <a href="#">✎</a> <a href="#">🗑</a></td>
    </tr>`).join('');
  $('#app').innerHTML = `
    <div class="panel">
      <div class="header">
        <div>
          <div style="font-weight:800;font-size:20px">Fleet Operators</div>
          <div class="muted">Manage and monitor your fleet operators</div>
        </div>
        <div>
          <button class="btn primary">+ Add Operator</button>
        </div>
      </div>
      <div class="space-between" style="margin:8px 0 12px 0">
        <input style="flex:1;margin-right:10px" class="ghost" type="text" placeholder="Search by name..." />
        <button class="btn">Search</button>
      </div>
      <div class="panel" style="padding:0">
        <table class="table">
          <thead><tr><th>Name</th><th>Code</th><th>Contact Email</th><th>Contact</th><th>TimeZone</th><th>Currency</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderOperatorDetail(){
  const o = data.operators[0];
  setHeader('Fleet Operators','Manage and monitor your fleet operators');
  $('#app').innerHTML = `
    <div class="space-between" style="margin-bottom:10px">
      <div>
        <a href="#/fleet-operators" class="muted">← Back to Fleet Operator</a>
        <div style="font-weight:800;font-size:26px;margin-top:6px">${o.name} • ${o.code.replace('ZENFLEET-','ZENFLEET-')} </div>
      </div>
      <div>
        <button class="btn">Refresh</button>
        <button class="btn primary">Edit Operator</button>
        <button class="btn">Delete</button>
      </div>
    </div>

    <div class="summary-cards">
      <div class="summary green">Loading...<div class="muted" style="font-weight:600">Total Vehicles</div></div>
      <div class="summary yellow">N/A<div class="muted" style="font-weight:600">Max Vehicles</div></div>
      <div class="summary blue">${o.contact}<div class="muted" style="font-weight:600">Contact</div></div>
    </div>

    <div class="row cols-2" style="margin-top:12px">
      <div class="panel">
        <h2>Fleet Operator Information</h2>
        <div class="kv">
          <div class="label">Name</div><div>${o.name}</div>
          <div class="label">Code</div><div>${o.code}</div>
          <div class="label">Contact</div><div>${o.contact}</div>
          <div class="label">Contact Email</div><div><a href="mailto:${o.email}">${o.email}</a></div>
          <div class="label">Timezone</div><div>${o.tz}</div>
          <div class="label">Currency</div><div>${o.currency}</div>
          <div class="label">Unit</div><div>imperial</div>
          <div class="label">Date Format</div><div>DD-MM-YYYY</div>
          <div class="label">Language</div><div>en</div>
          <div class="label">Address</div><div>45 Fleet Street, London, UK</div>
        </div>
      </div>
      <div class="panel">
        <h2>Branding</h2>
        <div class="kv">
          <div class="label">Primary Color</div><div>#6366F1</div>
          <div class="label">Logo</div><div>— (null)</div>
        </div>
        <h2 style="margin-top:16px">Metadata</h2>
        <div class="kv">
          <div class="label">Created At</div><div>—</div>
          <div class="label">Updated At</div><div>—</div>
        </div>
      </div>
    </div>
  `;
}

function renderVehicleDashboard(){
  const v = data.vehicle;
  setHeader('Vehicle Dashboard','vehicle Dashboard');
  $('#app').innerHTML = `
    <div class="panel">
      <div class="space-between" style="gap:10px;margin-bottom:10px">
        <div class="space-between" style="gap:10px">
          <div>Select Vehicle:</div>
          <select><option>${v.vin}</option></select>
        </div>
        <div><button class="btn primary">View Details</button></div>
      </div>

      <div class="vehicle-hero space-between">
        <div>
          <div class="hero-title">${v.vin}</div>
          <div class="muted">Vehicle ID: ${v.id}</div>
          <div class="muted">Date Range: 2025-08-11 → 2025-09-10</div>
        </div>
        <div class="hero-right">Battery Level <span style="font-size:28px">${v.battery}%</span></div>
      </div>

      <div class="kpi-grid" style="margin-top:12px">
        <div class="kpi green"><div class="muted">Max Speed</div><div style="font-size:22px;font-weight:800">${v.maxSpeed} km/h</div></div>
        <div class="kpi purple"><div class="muted">Avg Range</div><div style="font-size:22px;font-weight:800">${v.avgRange} km</div></div>
        <div class="kpi red"><div class="muted">Error Count</div><div style="font-size:22px;font-weight:800">${v.error}</div></div>
        <div class="kpi"><div class="muted">Trip Count</div><div style="font-size:22px;font-weight:800">${v.trip}</div></div>
        <div class="kpi"><div class="muted">Distance</div><div style="font-size:22px;font-weight:800">${v.distance} km</div></div>
        <div class="kpi yellow"><div class="muted">Battery</div><div style="font-size:22px;font-weight:800">${v.battery}%</div></div>
      </div>

      <div class="tabs">
        <div class="tab active">Motor Temp (°C)</div>
        <div class="tab">Battery %</div>
        <div class="tab">Speed (km/h)</div>
        <div class="tab">Range (km)</div>
        <div class="tab">Battery Power (kW)</div>
        <div class="tab">Tire Pressure</div>
      </div>

      <div class="card">
        <div style="font-weight:800;margin-bottom:8px">Motor Temp (°C)</div>
        <canvas id="motorTemp" class="chart"></canvas>
      </div>
    </div>
  `;
  const points = Array.from({length:42},(_,i)=>35 + i*0.9 + Math.sin(i/2)*2);
  drawLine($('#motorTemp'), points, '#3b82f6');
}

// Charts (Canvas)
function drawDonut(canvas, slices){
  const ctx = canvas.getContext('2d');
  const d = canvas.height = canvas.clientHeight; canvas.width = canvas.clientWidth;
  const cx = d/2, cy = d/2, r = Math.min(canvas.width, canvas.height)/2 - 10; 
  let total = slices.reduce((a,b)=>a+b.value,0), start= -Math.PI/2;
  slices.forEach(s=>{ const ang = (s.value/total)*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.fillStyle=s.color; ctx.arc(cx,cy,r,start,start+ang); ctx.fill(); start+=ang; });
  // hole
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath(); ctx.arc(cx,cy,r*0.6,0,Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation='source-over';
}

function drawLine(canvas, points, color){
  const ctx = canvas.getContext('2d');
  const h = canvas.height = canvas.clientHeight; canvas.width = canvas.clientWidth;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // grid
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
  for(let y=0;y<=5;y++){ const gy = (h-20) * (y/5) + 10; ctx.beginPath(); ctx.moveTo(30,gy); ctx.lineTo(canvas.width-10,gy); ctx.stroke(); }
  ctx.setLineDash([]);
  // line
  const min = Math.min(...points), max = Math.max(...points);
  const xstep = (canvas.width-50)/(points.length-1);
  ctx.strokeStyle = color; ctx.lineWidth=2; ctx.beginPath();
  points.forEach((v,i)=>{
    const x = 30 + i*xstep; const y = 10 + (h-20) * (1 - (v-min)/(max-min));
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

// Startup
function main(){
  $('#menuToggle').addEventListener('click', ()=>{
    $('#sidebar').classList.toggle('collapsed');
  });
  window.addEventListener('hashchange', navigate);
  navigate();
}

document.addEventListener('DOMContentLoaded', main);
