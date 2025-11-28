import React, { useState } from 'react'
import axios from 'axios'

export default function App(){
  const [img, setImg] = useState(null)
  const [userId, setUserId] = useState('alice')
  const [status, setStatus] = useState('')

  async function requestQr(action){
    setStatus('Requesting...')
    try{
      const res = await axios.post(`/api/qrcode/${action}`, { userId })
      setImg(res.data.qrImage)
      setStatus('')
    }catch(e){
      setStatus('Error: ' + (e.response?.data || e.message))
    }
  }

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>QR Time Tracker</h2>
      <div style={{marginBottom:10}}>
        <label>User ID: <input value={userId} onChange={e=>setUserId(e.target.value)} /></label>
      </div>
      <div style={{marginBottom:10}}>
        <button onClick={()=>requestQr('in')}>Einstempeln</button>
        <button onClick={()=>requestQr('out')} style={{marginLeft:10}}>Ausstempeln</button>
      </div>
      <div style={{marginTop:10}}>{status}</div>
      {img && (
        <div style={{marginTop:20}}>
          <img src={img} alt="qr" />
          <div style={{fontSize:12, color:'#666'}}>Scan this QR with the scanner service</div>
        </div>
      )}
    </div>
  )
}

