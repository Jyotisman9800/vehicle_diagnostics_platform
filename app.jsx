/* React single-file app using CDN + Babel (no build). */
const { useState, useEffect, useMemo, useRef } = React;

// Sample data
const DATA = {
  operators: [
    {id:4,name:'Zenfleet Solutions',code:'ZENFLEET-002',email:'support@zenfleet.io',contact:'+44-20-8946-0321',tz:'Europe/London',currency:'GBP'},
    {id:7,name:'abhishek',code:'123qw',email:'vishal922002@gmail.com',contact:'07780974308',tz:'Asia/Kolkata',currency:'USD'},
    {id:9,name:'shivam',code:'ABC001',email:'info@logisitck.com',contact:'09803175282',tz:'UTC',currency:'USD'}
  ],
  vehicle:{vin:'UAUZZZ8V5LA901234',id:5,battery:45,maxSpeed:64,avgRange:244.22,error:0,trip:1,distance:0},
};

// Utilities
const getPath = () => window.location.hash.replace('#','') || '/dashboard';

function DonutChart({slices}){
  const ref = useRef(null);
  useEffect(()=>{
    const c = ref.current; if(!c) return; const ctx=c.getContext('2d');
    const rect = c.getBoundingClientRect(); c.width=rect.width; c.height=rect.height||280;
    const cx=c.width/2, cy=c.height/2, r=Math.min(cx,cy)-10; let start=-Math.PI/2;
    const total=slices.reduce((a,b)=>a+b.value,0)||1; ctx.clearRect(0,0,c.width,c.height);
    slices.forEach(s=>{const ang=(s.value/total)*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.fillStyle=s.color;ctx.arc(cx,cy,r,start,start+ang);ctx.fill();start+=ang;});
    ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(cx,cy,r*0.6,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';
  },[slices]);
  return <canvas ref={ref} className="chart" />
}

function LineChart({points, color='#3b82f6'}){
  const ref = useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return; const ctx=c.getContext('2d');
    const rect=c.getBoundingClientRect(); c.width=rect.width; c.height=rect.height||280; const h=c.height;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.strokeStyle='#e5e7eb';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    for(let y=0;y<=5;y++){const gy=(h-20)*(y/5)+10;ctx.beginPath();ctx.moveTo(30,gy);ctx.lineTo(c.width-10,gy);ctx.stroke();}
    ctx.setLineDash([]);
    const min=Math.min(...points), max=Math.max(...points), xstep=(c.width-50)/(points.length-1);
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    points.forEach((v,i)=>{const x=30+i*xstep; const y=10+(h-20)*(1-(v-min)/(max-min||1)); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);});
    ctx.stroke();
  },[points,color]);
  return <canvas ref={ref} className="chart" />
}

function Sidebar({path}){
  const Item = ({href, children}) => (
    <a href={href} className={"item" + (path===href.slice(1)?' active':'')}>{children}</a>
  );
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">🚘</div>
        <div className="logo-text">
          <div className="brand">OEM Diagnostics</div>
          <div className="sub">Fleet Management</div>
        </div>
      </div>
      <div className="nav-search"><input type="text" placeholder="Search vehicles..." /></div>
      <nav className="nav">
        <div className="section">Overview</div>
        <Item href="#/dashboard">Dashboard</Item>
        <div className="section">Fleet Management</div>
        <Item href="#/fleet-operators">Fleet Operators</Item>
        <div className="section">Vehicles Management</div>
        <Item href="#/vehicle-dashboard">Vehicles Dashboard</Item>
        <Item href="#/vehicles">Vehicles</Item>
        <Item href="#/vehicle-types">Vehicle Types</Item>
        <div className="section">OBD Management</div>
        <Item href="#/obd-device">OBD Device</Item>
        <Item href="#/obd-telemetry">OBD Telemetry</Item>
        <div className="section">Monitoring</div>
        <Item href="#/alerts">Alerts</Item>
        <Item href="#/alerts-rules">Alerts Rule & Warnings</Item>
      </nav>
    </aside>
  );
}

function Topbar({title, subtitle}){
  return (
    <header className="topbar">
      <button className="icon-btn ghost" aria-label="Menu">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor"/></svg>
      </button>
      <div className="crumbs">
        <div className="breadcrumb">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <div className="top-actions">
        <button className="icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-12 0v5L4 18v1h16v-1l-2-2z" fill="currentColor"/></svg>
          <span className="badge-dot">3</span>
        </button>
        <button className="icon-btn" title="Settings">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19.14 12.94a7.952 7.952 0 0 0 .06-.94 7.952 7.952 0 0 0-.06-.94l2.03-1.58-1.92-3.32-2.39.96a7.994 7.994 0 0 0-1.63-.94l-.36-2.54h-3.84l-.36 2.54c-.57.23-1.12.54-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58c-.04.31-.06.62-.06.94 0 .32.02.63.06.94l-2.03 1.58 1.92 3.32 2.39-.96c.51.4 1.06.71 1.63.94l.36 2.54h3.84l.36-2.54c.57-.23 1.12-.54 1.63-.94l2.39.96 1.92-3.32-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" fill="currentColor"/></svg>
        </button>
        <div className="user">oemadmin</div>
        <button className="btn ghost">Logout</button>
      </div>
    </header>
  );
}

// Pages
function FleetDashboard(){
  return (
    <div className="container">
      <div className="row cols-2">
        <div className="panel">
          <h2>Fleet Summary</h2>
          <div className="kpi-grid">
            <div className="kpi purple"><div className="muted">Total Vehicles</div><div style={{fontSize:24,fontWeight:800}}>15</div></div>
            <div className="kpi green"><div className="muted">Online Vehicles</div><div style={{fontSize:24,fontWeight:800}}>0</div><div className="muted">0% of fleet</div></div>
            <div className="kpi red"><div className="muted">Critical Alerts</div><div style={{fontSize:24,fontWeight:800}}>0</div></div>
            <div className="kpi yellow"><div className="muted">Active Trips</div><div style={{fontSize:24,fontWeight:800}}>0</div><div className="muted">0 km today</div></div>
          </div>
        </div>
        <div className="panel">
          <h2>Vehicle Status</h2>
          <DonutChart slices={[{value:9,color:'#22c55e'},{value:3,color:'#3b82f6'},{value:2,color:'#f59e0b'},{value:1,color:'#ef4444'}]} />
          <div className="muted" style={{marginTop:6}}>Available • In Use • Maintenance • Offline</div>
        </div>
      </div>

      <div className="row cols-2" style={{marginTop:12}}>
        <div className="panel">
          <h2>Telemetry Overview</h2>
          <div className="kpi-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
            <div className="kpi"><div className="muted">Avg Battery</div><div style={{fontSize:22,fontWeight:800}}>66%</div></div>
            <div className="kpi"><div className="muted">Avg Range</div><div style={{fontSize:22,fontWeight:800}}>369.6 km</div></div>
          </div>
        </div>
        <div className="panel">
          <h2>Alerts Panel</h2>
          <DonutChart slices={[{value:1,color:'#ef4444'},{value:8,color:'#f59e0b'},{value:1,color:'#22c55e'}]} />
          <div className="muted" style={{marginTop:6}}>1 Critical, 8 Medium, 1 Low</div>
        </div>
      </div>
    </div>
  );
}

function FleetOperators(){
  return (
    <div className="container">
      <div className="panel">
        <div className="header">
          <div>
            <div style={{fontWeight:800,fontSize:20}}>Fleet Operators</div>
            <div className="muted">Manage and monitor your fleet operators</div>
          </div>
          <div><button className="btn primary">+ Add Operator</button></div>
        </div>
        <div className="space-between" style={{margin:'8px 0 12px 0'}}>
          <input style={{flex:1,marginRight:10}} className="ghost" placeholder="Search by name..." />
          <button className="btn">Search</button>
        </div>
        <div className="panel" style={{padding:0}}>
          <table className="table">
            <thead><tr><th>Name</th><th>Code</th><th>Contact Email</th><th>Contact</th><th>TimeZone</th><th>Currency</th><th>Actions</th></tr></thead>
            <tbody>
              {DATA.operators.map(o=> (
                <tr key={o.id}>
                  <td><a href={`#/fleet-operators/${o.id}`}>{o.name}</a></td>
                  <td>{o.code}</td>
                  <td>{o.email}</td>
                  <td>{o.contact}</td>
                  <td>{o.tz}</td>
                  <td>{o.currency}</td>
                  <td className="actions"><a href={`#/fleet-operators/${o.id}`}>👁</a> <a href="#">✎</a> <a href="#">🗑</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OperatorDetail(){
  const o = DATA.operators[0];
  return (
    <div className="container">
      <div className="space-between" style={{marginBottom:10}}>
        <div>
          <a href="#/fleet-operators" className="muted">← Back to Fleet Operator</a>
          <div style={{fontWeight:800,fontSize:26,marginTop:6}}>{o.name} • {o.code}</div>
        </div>
        <div>
          <button className="btn">Refresh</button>
          <button className="btn primary">Edit Operator</button>
          <button className="btn">Delete</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary green">Loading...<div className="muted" style={{fontWeight:600}}>Total Vehicles</div></div>
        <div className="summary yellow">N/A<div className="muted" style={{fontWeight:600}}>Max Vehicles</div></div>
        <div className="summary blue">{o.contact}<div className="muted" style={{fontWeight:600}}>Contact</div></div>
      </div>

      <div className="row cols-2" style={{marginTop:12}}>
        <div className="panel">
          <h2>Fleet Operator Information</h2>
          <div className="kv">
            <div className="label">Name</div><div>{o.name}</div>
            <div className="label">Code</div><div>{o.code}</div>
            <div className="label">Contact</div><div>{o.contact}</div>
            <div className="label">Contact Email</div><div><a href={`mailto:${o.email}`}>{o.email}</a></div>
            <div className="label">Timezone</div><div>{o.tz}</div>
            <div className="label">Currency</div><div>{o.currency}</div>
            <div className="label">Unit</div><div>imperial</div>
            <div className="label">Date Format</div><div>DD-MM-YYYY</div>
            <div className="label">Language</div><div>en</div>
            <div className="label">Address</div><div>45 Fleet Street, London, UK</div>
          </div>
        </div>
        <div className="panel">
          <h2>Branding</h2>
          <div className="kv">
            <div className="label">Primary Color</div><div>#6366F1</div>
            <div className="label">Logo</div><div>— (null)</div>
          </div>
          <h2 style={{marginTop:16}}>Metadata</h2>
          <div className="kv">
            <div className="label">Created At</div><div>—</div>
            <div className="label">Updated At</div><div>—</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleDashboard(){
  const v = DATA.vehicle;
  const points = useMemo(()=>Array.from({length:42},(_,i)=>35+i*0.9+Math.sin(i/2)*2),[]);
  return (
    <div className="container">
      <div className="panel">
        <div className="space-between" style={{gap:10,marginBottom:10}}>
          <div className="space-between" style={{gap:10}}>
            <div>Select Vehicle:</div>
            <select><option>{v.vin}</option></select>
          </div>
          <div><button className="btn primary">View Details</button></div>
        </div>

        <div className="vehicle-hero space-between">
          <div>
            <div className="hero-title">{v.vin}</div>
            <div className="muted">Vehicle ID: {v.id}</div>
            <div className="muted">Date Range: 2025-08-11 → 2025-09-10</div>
          </div>
          <div className="hero-right">Battery Level <span style={{fontSize:28}}>{v.battery}%</span></div>
        </div>

        <div className="kpi-grid" style={{marginTop:12}}>
          <div className="kpi green"><div className="muted">Max Speed</div><div style={{fontSize:22,fontWeight:800}}>{v.maxSpeed} km/h</div></div>
          <div className="kpi purple"><div className="muted">Avg Range</div><div style={{fontSize:22,fontWeight:800}}>{v.avgRange} km</div></div>
          <div className="kpi red"><div className="muted">Error Count</div><div style={{fontSize:22,fontWeight:800}}>{v.error}</div></div>
          <div className="kpi"><div className="muted">Trip Count</div><div style={{fontSize:22,fontWeight:800}}>{v.trip}</div></div>
          <div className="kpi"><div className="muted">Distance</div><div style={{fontSize:22,fontWeight:800}}>{v.distance} km</div></div>
          <div className="kpi yellow"><div className="muted">Battery</div><div style={{fontSize:22,fontWeight:800}}>{v.battery}%</div></div>
        </div>

        <div className="tabs">
          <div className="tab active">Motor Temp (°C)</div>
          <div className="tab">Battery %</div>
          <div className="tab">Speed (km/h)</div>
          <div className="tab">Range (km)</div>
          <div className="tab">Battery Power (kW)</div>
          <div className="tab">Tire Pressure</div>
        </div>

        <div className="card">
          <div style={{fontWeight:800,marginBottom:8}}>Motor Temp (°C)</div>
          <LineChart points={points} color="#3b82f6" />
        </div>
      </div>
    </div>
  );
}

function App(){
  const [path, setPath] = useState(getPath());
  useEffect(()=>{ const onHash=()=>setPath(getPath()); window.addEventListener('hashchange', onHash); return ()=>window.removeEventListener('hashchange', onHash);},[]);

  const header = useMemo(()=>{
    if(path.startsWith('/fleet-operators/')) return {title:'Fleet Operators', subtitle:'Manage and monitor your fleet operators'};
    switch(path){
      case '/fleet-operators': return {title:'Fleet Operators', subtitle:'Manage and monitor your fleet operators'};
      case '/vehicle-dashboard': return {title:'Vehicle Dashboard', subtitle:'vehicle Dashboard'};
      default: return {title:'Fleet Dashboard', subtitle:'Real-time diagnostics and fleet management'};
    }
  },[path]);

  let View = FleetDashboard;
  if(path==='/fleet-operators') View = FleetOperators;
  else if(path.startsWith('/fleet-operators/')) View = OperatorDetail;
  else if(path==='/vehicle-dashboard') View = VehicleDashboard;

  return (
    <div className="layout">
      <Sidebar path={path} />
      <main className="main">
        <Topbar title={header.title} subtitle={header.subtitle} />
        <View />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

