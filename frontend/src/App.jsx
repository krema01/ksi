import React, { useState } from 'react'
import axios from 'axios'
import './App.css' // Import the CSS file for styling

export default function App(){
  const [img, setImg] = useState(null)
  const [payload, setPayload] = useState(null)
  const [signature, setSignature] = useState(null)
  const [userId, setUserId] = useState('alice')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])

  async function requestQr(action){
    setLoading(true)
    setStatus('')
    try{
      const res = await axios.post(`/api/qrcode/${action}`, { userId })
      setImg(res.data.qrImage)
      setPayload(res.data.payload)
      setSignature(res.data.signature)
      setStatus('QR generiert — bereit zum Simulieren')
    }catch(e){
      setStatus('Fehler: ' + (e.response?.data || e.message))
    }
    setLoading(false)
  }

  async function simulateScan(){
    if(!payload || !signature){
      setStatus('Keine QR-Daten vorhanden — bitte erst QR generieren')
      return
    }
    setLoading(true)
    setStatus('Simuliere Scan...')
    try{
      await axios.post(`/api/scan`, { payload, signature })
      setStatus('Scan erfolgreich — Eintrag gespeichert')
      await fetchLogs()
    }catch(e){
      setStatus('Fehler beim Simulieren: ' + (e.response?.data || e.message))
    }
    setLoading(false)
  }

  async function fetchLogs(){
    try{
      const res = await axios.get(`/api/timelogs`, { params: { userId } })
      setLogs(res.data || [])
    }catch(e){
      setStatus('Fehler beim Laden der Logs: ' + (e.response?.data || e.message))
    }
  }

  return (
    <div className="app-bg">
      <div className="card">
        <h1 className="title">Willkommen zum QR Zeit-Tracker</h1>
        <div className="subtitle">Stempeln Sie sich einfach ein und aus – schnell & sicher!</div>
        <div className="input-row">
          <label htmlFor="userId">Benutzername:</label>
          <input id="userId" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="Ihr Name oder Kürzel" />
        </div>
        <div className="button-row">
          <button className="action-btn in" onClick={()=>requestQr('in')} disabled={loading}>
            {loading ? 'Lädt...' : 'Einstempeln'}
          </button>
          <button className="action-btn out" onClick={()=>requestQr('out')} disabled={loading}>
            {loading ? 'Lädt...' : 'Ausstempeln'}
          </button>
        </div>
        {status && <div className={status.startsWith('Fehler') ? 'status error' : 'status'}>{status}</div>}
        {img && (
          <div className="qr-section">
            <img src={img} alt="qr" className="qr-img" />
            <div className="qr-hint">Scannen Sie diesen QR-Code mit dem Scanner-Service</div>
            <div style={{marginTop:10, display:'flex', gap:8}}>
              <button className="action-btn in" onClick={simulateScan} disabled={loading}>Simuliere Scan</button>
              <button className="action-btn out" onClick={fetchLogs} disabled={loading}>Lade Logs</button>
            </div>
            <div style={{marginTop:8, fontSize:12, color:'#666', textAlign:'left', maxWidth:300}}>
              <div><strong>Payload:</strong> <code style={{wordBreak:'break-all'}}>{payload}</code></div>
              <div style={{marginTop:6}}><strong>Signature:</strong> <code style={{wordBreak:'break-all'}}>{signature}</code></div>
            </div>
          </div>
        )}
        {logs.length>0 && (
          <div style={{width:'100%', marginTop:14}}>
            <h3 style={{margin:'8px 0'}}>Zeit-Logs</h3>
            <ul style={{paddingLeft:18}}>
              {logs.map(l => (
                <li key={l.id}>{l.timestamp} — {l.userId} — {l.action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="footer">© 2025 QR Zeit-Tracker</footer>
    </div>
  )
}
