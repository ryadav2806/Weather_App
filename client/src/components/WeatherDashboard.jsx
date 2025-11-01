
import React, { useState, useEffect } from 'react'

export default function WeatherDashboard(){
  const [city, setCity] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchWeather(q){
    setLoading(true);
    setError('');
    try{
      const res = await fetch(`/api/weather?city=${encodeURIComponent(q)}`);
      if(!res.ok){
        const body = await res.json().catch(()=>({error:'Unknown'}));
        throw new Error(body.error || JSON.stringify(body));
      }
      const data = await res.json();
      setResult(data);
      loadHistory();
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }

  async function loadHistory(){
    try{
      const res = await fetch('/api/history');
      const items = await res.json();
      setHistory(items);
    }catch(err){
      console.error('History load error', err);
    }
  }

  useEffect(()=>{ loadHistory(); }, []);

  return (
    <div className="card">
      <div className="controls">
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter city e.g., Mumbai" />
        <button onClick={()=>{ if(city.trim()) fetchWeather(city.trim()); }}>Search</button>
      </div>

      <div className="result">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {result && !error && (
          <div>
            <strong>{result.city}</strong>: {result.temp_c} °C — {result.description}
          </div>
        )}
      </div>

      <div className="history">
        <h3>Last 10 searches</h3>
        {history.length===0 && <p>No searches yet.</p>}
        <ul>
          {history.map(h=>(
            <li key={h.id}>
              {h.city} — {h.temp_c} °C — {h.description} — {new Date(h.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
