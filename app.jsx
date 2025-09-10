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
const getPath = () => window.location.hash.replace('#','') || '/launchpad';

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
      case '/launchpad': return {title:'IPE Launchpad', subtitle:'Reference dashboard layout'};
      case '/fleet-operators': return {title:'Fleet Operators', subtitle:'Manage and monitor your fleet operators'};
      case '/vehicle-dashboard': return {title:'Vehicle Dashboard', subtitle:'vehicle Dashboard'};
      default: return {title:'Fleet Dashboard', subtitle:'Real-time diagnostics and fleet management'};
    }
  },[path]);

  let View = FleetDashboard;
  if(path==='/fleet-operators') View = FleetOperators;
  else if(path.startsWith('/fleet-operators/')) View = OperatorDetail;
  else if(path==='/vehicle-dashboard') View = VehicleDashboard;
  else if(path==='/launchpad') View = Launchpad;

  return (
    path==='/launchpad' ? (
      <Launchpad />
    ) : (
      <div className="layout">
        <Sidebar path={path} />
        <main className="main">
          <Topbar title={header.title} subtitle={header.subtitle} />
          <View />
        </main>
      </div>
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Launchpad (wireframe-exact) view used for parity with your screenshots
function Launchpad(){
  const [open, setOpen] = useState(false);
  const KPI = ({title, value, sub}) => (
    <div className="lp-kpi">
      <header><span className="kpi-meta tbd">TBD</span><span className="kpi-title">{title}</span></header>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
  return (
    <div className="lp">
      <header className="lp-appbar">
        <div className="lp-left">
          <div className="lp-brand"><span className="badge">IPE</span><h1>Launchpad</h1><button className="primary small">+ New</button></div>
        </div>
        <div className="lp-center">
          <div className="lp-search"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#98a2b3"/></svg><input placeholder="Search"/></div>
        </div>
        <div className="lp-right">
          <div className="range"><span>Last</span><button className="chip">60 days ▾</button></div>
          <button className="icon-btn" onClick={()=>setOpen(true)} aria-label="Notifications"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-12 0v5L4 18v1h16v-1l-2-2z" fill="currentColor"/></svg></button>
        </div>
      </header>

      <main className="lp-main">
        <section className="lp-kpis">
          <KPI title="Customs" value="1,097" sub="Open Cases" />
          <KPI title="Buy" value="685" sub="Open Cases" />
          <KPI title="Direct Seizure" value="533" sub="Open Cases" />
          <KPI title="Civil" value="455" sub="Open Cases" />
          <KPI title="Investigations" value="109" sub="Open Cases" />
          <KPI title="Trainings" value="10" sub="Open Cases" />
          <KPI title="Online Takedown" value="167,106" sub="Open Cases" />
          <KPI title="Standalone" value="3,139" sub="Open Cases" />
        </section>

        <section className="lp-grid-3">
          <div className="card list-card">
            <div className="card-head"><h2>Key Case Phases – All Programs</h2><button className="icon-btn" aria-label="Expand"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button></div>
            <ul className="lp-list">
              <li className="active">All Programs</li>
              <li>Customs</li>
              <li>Buy</li>
              <li>Direct Seizure</li>
              <li>Civil</li>
              <li>Investigations</li>
              <li>Online Takedowns</li>
              <li>Standalone</li>
            </ul>
            <div className="mini-cards">
              <div className="mini"><span className="tbd">TBD</span><div className="big">1,262</div><div className="label">Seized</div></div>
              <div className="mini"><span className="tbd">TBD</span><div className="big">412</div><div className="label">CAD Letters</div></div>
              <div className="mini"><span className="tbd">TBD</span><div className="big">3</div><div className="label">Objections</div></div>
              <div className="mini"><span className="tbd">TBD</span><div className="big">615</div><div className="label">Platform Pushback</div></div>
              <div className="mini"><span className="tbd">TBD</span><div className="big">143</div><div className="label">Determination Made</div></div>
              <div className="mini"><span className="tbd">TBD</span><div className="big">10</div><div className="label">Training Complete</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Image Review Status</h2></div>
            <div className="lp-bars">
              {['In Progress','Outstanding','Completed','Further Review','New Image Required'].map((label,i)=> (
                <div className="lp-bar-row" key={label}>
                  <span>{label}</span>
                  <div className="lp-bar"><span style={{width:[70,45,22,10,6][i]+'%'}}></span></div>
                  <span className="pct">000%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card tasks">
            <div className="card-head"><h2>All Critical Tasks</h2><button className="icon-btn" aria-label="Expand"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg></button></div>
            <ul className="tasks-list">
              <li><span>Review Images</span> <span className="pill">957</span></li>
              <li><span>New Image Required</span> <span className="pill">111</span></li>
              <li><span>Liaison With</span> <span className="pill">75</span></li>
              <li><span>Others</span> <span className="pill">173</span></li>
            </ul>
          </div>
        </section>

        <section className="grid-2" style={{marginTop:12}}>
          <div className="card map"><div className="card-head"><h2>Repeat Offenders</h2></div><div className="world"></div></div>
          <div className="card map"><div className="card-head"><h2>Product Seizures by Country</h2></div><div className="world faded"></div></div>
        </section>
      </main>

      <aside className={"lp-drawer" + (open?" open":"")} aria-hidden={!open}>
        <div className="drawer-head"><h2>Notifications</h2><button className="icon-btn" onClick={()=>setOpen(false)} aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M18.3 5.71L12 12.01 5.7 5.7 4.29 7.11 10.59 13.4 4.3 19.7l1.41 1.41 6.29-6.29 6.29 6.29 1.41-1.41-6.29-6.29 6.3-6.29z" fill="currentColor"/></svg></button></div>
        <div className="drawer-body">
          {[{t:'Alert 1',d:"Today's Date",c:'What action makes the most sense...'},
            {t:'Alert 2',d:'Yesterday\'s Date',c:'Should the Notifications icon live in the Top Nav...'},
            {t:'Message 1',d:"Today\'s Date",c:'Sometimes, messages will be long...'},
            {t:'Message 2',d:"Yesterday\'s Date",c:'What are the sort and filter criteria...'}].map((n,i)=> (
            <div className={"note "+(i<2?"alert":"msg")} key={i}>
              <div className="meta"><span>{n.t}</span><span>•</span><span>{n.d}</span></div>
              <div className="text">{n.c}</div>
              <div className="actions"><a href="#">Read</a><a href="#">Done</a><a href="#">Save</a></div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
