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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [misuseReason, setMisuseReason] = useState(null)
  const [misuses, setMisuses] = useState([])
  const [showMisuses, setShowMisuses] = useState(false)

  async function requestQr(action){
    setLoading(true)
    setStatus('')
    setMisuseReason(null)
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

  async function fetchMisuses(){
    try{
      const res = await axios.get('/api/misuses', { params: { userId } })
      setMisuses(res.data || [])
      setShowMisuses(true)
    }catch(e){
      setStatus('Fehler beim Laden der Misuse-Einträge: ' + (e.response?.data || e.message))
    }
  }

  async function simulateScan(){
    if(!payload || !signature){
      setStatus('Keine QR-Daten vorhanden — bitte erst QR generieren')
      return
    }
    setLoading(true)
    setStatus('Simuliere Scan...')
    setMisuseReason(null)
    try{
      const res = await axios.post(`/api/scan`, { payload, signature })
      // backend now returns { status: 'ok', misuse: boolean, reason?: string }
      if(res.data && res.data.misuse){
        setStatus('Warnung: Doppelbuchung erkannt — Eintrag wurde dennoch gespeichert')
        setMisuseReason(res.data.reason || 'Unbekannter Grund')
      } else {
        setStatus('Scan erfolgreich — Eintrag gespeichert')
      }
      await fetchLogs()
    }catch(e){
      setStatus('Fehler beim Simulieren: ' + (e.response?.data || e.message))
    }
    setLoading(false)
  }

  async function fetchLogs(){
    try{
      const res = await axios.get(`/api/timelogs`, { params: { userId } })
      // sort by id descending (newest first) and reset paging
      const sorted = (res.data || []).slice().sort((a,b)=> (b.id||0)-(a.id||0))
      setLogs(sorted)
      setPage(1)
    }catch(e){
      setStatus('Fehler beim Laden der Logs: ' + (e.response?.data || e.message))
    }
  }

  function formatTimestamp(ts){
    try{
      const d = new Date(ts)
      if(isNaN(d.getTime())) return ts
      return d.toLocaleString()
    }catch(e){
      return ts
    }
  }

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize))
  const visibleLogs = logs.slice((page-1)*pageSize, page*pageSize)

  function prevPage(){ setPage(p => Math.max(1, p-1)) }
  function nextPage(){ setPage(p => Math.min(totalPages, p+1)) }

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
        {misuseReason && (
          <div className="status warning" style={{marginTop:8}}>
            <strong>Warnung:</strong> {misuseReason}
          </div>
        )}
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
          <div style={{width:'100%', marginTop:14}} className="logs-wrapper">
            <div className="logs-header">
              <h3 style={{margin:'4px 0'}}>Zeit-Logs</h3>
              <div className="logs-controls">
                <label>Zeilen/Seite:
                  <select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </label>
                <button className="link-btn" onClick={fetchLogs} disabled={loading}>Aktualisieren</button>
                <button className="link-btn" onClick={fetchMisuses} disabled={loading}>Show Misuses</button>
              </div>
            </div>

            <table className="logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.map(l => (
                  <tr key={l.id}>
                    <td>{formatTimestamp(l.timestamp)}</td>
                    <td>{l.userId}</td>
                    <td>{l.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={prevPage} disabled={page<=1}>&larr; Prev</button>
              <div className="page-indicator">Seite {page} / {totalPages}</div>
              <button onClick={nextPage} disabled={page>=totalPages}>Next &rarr;</button>
            </div>
          </div>
        )}
        {showMisuses && (
          <div style={{width:'100%', marginTop:14}} className="misuses-wrapper">
            <h3>Misuse Records ({misuses.length})</h3>
            <table className="logs-table">
              <thead>
                <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Reason</th></tr>
              </thead>
              <tbody>
                {misuses.map(m => (
                  <tr key={m.id}>
                    <td>{new Date(m.timestamp).toLocaleString()}</td>
                    <td>{m.userId}</td>
                    <td>{m.action}</td>
                    <td>{m.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <footer className="footer">© 2025 QR Zeit-Tracker</footer>
    </div>
  )
}
