import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import SiteA from './Micron_A_ChipQA'
import SiteB from './Micron_B_math'

function App() {
  const [site, setSite] = useState<'home' | 'A' | 'B'>('home')

  if (site === 'A') {
    return (
      <>
        <button onClick={() => setSite('home')} style={{position:'fixed', top:'20px', left:'20px', zIndex:9999, padding:'10px 20px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>⬅ 返回首頁</button>
        <SiteA />
      </>
    )
  }

  if (site === 'B') {
    return (
      <>
        <button onClick={() => setSite('home')} style={{position:'fixed', top:'20px', left:'20px', zIndex:9999, padding:'10px 20px', background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>⬅ 返回首頁</button>
        <SiteB />
      </>
    )
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyHex:'center', justifyContent:'center', minHeight:'100vh', backgroundColor:'#f3f4f6', fontFamily:'system-ui, sans-serif'}}>
      <h1 style={{fontSize:'2.2rem', fontWeight:'bold', color:'#1f2937', marginBottom:'2rem'}}>美光日本專案 ─ 網站入口</h1>
      <div style={{display:'flex', gap:'1.5rem'}}>
        <button onClick={() => setSite('A')} style={{padding:'1.2rem 2rem', backgroundColor:'#10b981', color:'white', fontSize:'1.2rem', fontWeight:'bold', border:'none', borderRadius:'1rem', cursor:'pointer', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
          進入 Micron A (ChipQA)
        </button>
        <button onClick={() => setSite('B')} style={{padding:'1.2rem 2rem', backgroundColor:'#6366f1', color:'white', fontSize:'1.2rem', fontWeight:'bold', border:'none', borderRadius:'1rem', cursor:'pointer', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>
          進入 Micron B (Math)
        </button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)