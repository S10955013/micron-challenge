import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteA from './Micron_A_ChipQA'
import SiteB from './Micron_B_math'
import SiteD from './Micron_D_memory';

function Router() {
  const path = window.location.pathname.toLowerCase()

  if (path === '/a' || path === '/chipqa') {
    return <SiteA />
  }
  
  if (path === '/b' || path === '/math') {
    return <SiteB />
  }

  if (path === '/d' || path === '/memory') {
    return <SiteD />
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', backgroundColor:'#f3f4f6', fontFamily:'system-ui, sans-serif'}}>
      <h1 style={{fontSize:'2rem', fontWeight:'bold', color:'#1f2937'}}>科技賦能，台日共好</h1>
      <p style={{color:'#6b7280', marginTop:'1rem'}}>請點選關卡網址直接進入：</p>
      <div style={{marginTop:'1rem', display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'flex-start'}}>
        <a href="/A" style={{color:'#2563eb', textDecoration:'underline', fontSize:'1.2rem'}}>👉 關卡 A</a>
        <a href="/B" style={{color:'#2563eb', textDecoration:'underline', fontSize:'1.2rem'}}>👉 關卡 B</a>
        <a href="/D" style={{color:'#2563eb', textDecoration:'underline', fontSize:'1.2rem'}}>👉 關卡 D</a>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)