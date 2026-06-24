import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteA from './Micron_A_ChipQA'
import SiteB from './Micron_B_math'

function Router() {
  const path = window.location.pathname.toLowerCase()

  if (path === '/a' || path === '/chipqa') {
    return <SiteA />
  }
  
  if (path === '/b' || path === '/math') {
    return <SiteB />
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', backgroundColor:'#f3f4f6', fontFamily:'system-ui, sans-serif'}}>
      <h1 style={{fontSize:'2rem', fontWeight:'bold', color:'#1f2937'}}>美光日本專案 ─ 雲端測驗系統</h1>
      <p style={{color:'#6b7280', marginTop:'1rem'}}>請使用專屬關卡網址直接進入：</p>
      <div style={{marginTop:'1rem', display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'flex-start'}}>
        <code>👉 關卡 A 網址：您的網址/A</code>
        <code>👉 關卡 B 網址：您的網址/B</code>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)