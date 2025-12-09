import React, { useEffect, useMemo, useState, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { checkStatus, fetchHeartbeat, simulateFL } from './api';

function Section({ title, children, icon }) {
  return (
    <div className="card">
      <h2>{icon && <span style={{ marginRight: '8px' }}>{icon}</span>}{title}</h2>
      {children}
    </div>
  );
}

function StatCard({ title, value, unit, icon, color, trend }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}<span className="stat-unit">{unit}</span></div>
        {trend && <div className="stat-trend" style={{ color: trend > 0 ? '#00e676' : '#ff1744' }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>}
      </div>
    </div>
  );
}

function HeartRatePanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [speed, setSpeed] = useState(2000);
  const [showAlert, setShowAlert] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [prevAvg, setPrevAvg] = useState(null);
  const audioRef = useRef(null);
  
  const playAlertSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };
  
  const exportData = () => {
    const csv = 'Thời gian,Nhịp TB (bpm),Rủi ro,Max,Min\n' + 
      history.map(h => `${h.time},${h.avg},${h.risk},${h.max || 0},${h.min || 0}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heartrate_${Date.now()}.csv`;
    a.click();
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchHeartbeat(60);
      setData(res);
      const timestamp = new Date().toLocaleTimeString('vi-VN');
      const avgVal = (res.values.reduce((a, b) => a + b, 0) / res.values.length).toFixed(1);
      const maxVal = Math.max(...res.values).toFixed(0);
      const minVal = Math.min(...res.values).toFixed(0);
      
      setHistory(prev => [{ time: timestamp, avg: avgVal, risk: res.predictedRisk, max: maxVal, min: minVal, data: res }, ...prev].slice(0, 20));
      
      if (prevAvg) setPrevAvg(avgVal);
      else setPrevAvg(avgVal);
      
      // Check for alerts
      if (parseFloat(avgVal) > 100 || parseFloat(avgVal) < 60) {
        const condition = parseFloat(avgVal) > 100 ? 'tachycardia' : 'bradycardia';
        setShowAlert({ condition, avg: avgVal, timestamp });
        playAlertSound();
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualInput = () => {
    try {
      const hr = parseFloat(manualInput);
      if (isNaN(hr) || hr < 40 || hr > 200) {
        alert('Vui lòng nhập nhịp tim từ 40 đến 200 bpm');
        return;
      }
      
      // Generate realistic ECG pattern around the input value
      const values = [];
      for (let i = 0; i < 60; i++) {
        const phase = (i % 20) / 20.0;
        let ecgValue = 0;
        
        if (phase > 0.3 && phase < 0.35) {
          ecgValue = hr + (phase - 0.3) / 0.05 * 40;
        } else if (phase >= 0.35 && phase < 0.4) {
          ecgValue = hr + 40 - (phase - 0.35) / 0.05 * 40;
        } else if (phase > 0.5 && phase < 0.65) {
          ecgValue = hr + Math.sin((phase - 0.5) / 0.15 * Math.PI) * 8;
        } else {
          ecgValue = hr + (Math.random() - 0.5) * 4;
        }
        values.push(Math.round(ecgValue * 100) / 100);
      }
      
      const riskScore = hr < 60 ? 0.3 : hr > 100 ? 0.5 : 0.1;
      const res = { values, predictedRisk: Math.round(riskScore * 100) / 100 };
      setData(res);
      
      const timestamp = new Date().toLocaleTimeString('vi-VN');
      const maxVal = Math.max(...values).toFixed(0);
      const minVal = Math.min(...values).toFixed(0);
      setHistory(prev => [{ time: timestamp, avg: hr.toFixed(1), risk: res.predictedRisk, max: maxVal, min: minVal, data: res }, ...prev].slice(0, 20));
      setManualInput('');
      
      if (hr > 100 || hr < 60) {
        const condition = hr > 100 ? 'tachycardia' : 'bradycardia';
        setShowAlert({ condition, avg: hr.toFixed(1), timestamp });
        playAlertSound();
      }
    } catch (err) {
      alert('Lỗi xử lý: ' + err.message);
    }
  };

  useEffect(() => { load(); }, []);
  
  // Auto-refresh with configurable speed
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(load, speed);
    return () => clearInterval(interval);
  }, [isStreaming, speed]);

  const avg = useMemo(() => {
    if (!data) return 0;
    return (data.values.reduce((a, b) => a + b, 0) / data.values.length).toFixed(1);
  }, [data]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.values.map((v, i) => ({ time: i, hr: parseFloat(v.toFixed(1)) }));
  }, [data]);

  const max = useMemo(() => data ? Math.max(...data.values).toFixed(0) : 0, [data]);
  const min = useMemo(() => data ? Math.min(...data.values).toFixed(0) : 0, [data]);
  
  const pathology = useMemo(() => {
    if (!data) return { status: 'Chưa có dữ liệu', color: '#888', condition: 'unknown' };
    const avgVal = parseFloat(avg);
    const variance = data.values.reduce((sum, v) => sum + Math.pow(v - avgVal, 2), 0) / data.values.length;
    const stdDev = Math.sqrt(variance);
    
    if (avgVal < 60) return { status: 'CHẬM TIM (Bradycardia)', color: '#4fc3f7', condition: 'bradycardia' };
    if (avgVal > 100) return { status: 'NHANH TIM (Tachycardia)', color: '#ff1744', condition: 'tachycardia' };
    if (stdDev > 12) return { status: 'LOẠN NHỊP (Arrhythmia)', color: '#ffa726', condition: 'arrhythmia' };
    return { status: 'BÌNH THƯỜNG', color: '#00e676', condition: 'normal' };
  }, [data, avg]);
  
  const aiInsights = useMemo(() => {
    if (!data || history.length < 3) return null;
    const recentAvgs = history.slice(0, 5).map(h => parseFloat(h.avg));
    const trend = recentAvgs[0] - recentAvgs[recentAvgs.length - 1];
    const avgRecent = recentAvgs.reduce((a, b) => a + b, 0) / recentAvgs.length;
    
    let insight = '';
    let recommendation = '';
    
    if (Math.abs(trend) > 10) {
      insight = trend > 0 ? '📈 Nhịp tim đang tăng dần' : '📉 Nhịp tim đang giảm dần';
      recommendation = trend > 0 ? 'Nên nghỉ ngơi, uống nước, tránh vận động mạnh' : 'Cân nhắc vận động nhẹ để tăng tuần hoàn';
    } else if (avgRecent > 90) {
      insight = '⚡ Nhịp tim cao kéo dài';
      recommendation = 'Kiểm tra căng thẳng, caffeine, hoặc tham khảo bác sĩ';
    } else if (avgRecent < 65) {
      insight = '🧘 Nhịp tim thấp ổn định';
      recommendation = 'Tốt cho thể lực, theo dõi nếu có triệu chứng chóng mặt';
    } else {
      insight = '✅ Nhịp tim ổn định trong ngưỡng bình thường';
      recommendation = 'Tiếp tục duy trì lối sống lành mạnh';
    }
    
    return { insight, recommendation };
  }, [data, history]);
  
  const trend = useMemo(() => {
    if (!prevAvg || !avg) return 0;
    return (((parseFloat(avg) - parseFloat(prevAvg)) / parseFloat(prevAvg)) * 100).toFixed(1);
  }, [avg, prevAvg]);

  return (
    <Section title="Nhịp tim & dự đoán" icon="💓">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LNmHAU7k9n1yn0vBSh+zPLaizsKGGS563+mWBELTKXh8LdnGwU8lNrzzn4sGw==" preload="auto" />
      {data && (
        <div className="stats-grid">
          <StatCard title="Nhịp TB" value={avg} unit=" bpm" icon="❤️" color={pathology.color} trend={parseFloat(trend)} />
          <StatCard title="Max" value={max} unit=" bpm" icon="⬆️" color="#ff1744" />
          <StatCard title="Min" value={min} unit=" bpm" icon="⬇️" color="#4fc3f7" />
          <StatCard title="Rủi ro" value={(data.predictedRisk * 100).toFixed(0)} unit="%" icon="⚠️" color={data.predictedRisk > 0.5 ? '#ff1744' : '#00e676'} />
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={load} disabled={loading || isStreaming}>{loading ? 'Đang tải...' : 'Lấy mẫu mới'}</button>
        <button onClick={() => setIsStreaming(!isStreaming)} style={{ background: isStreaming ? '#ff1744' : '#00e676' }}>
          {isStreaming ? '⏸ Dừng đo' : '▶ Đo liên tục'}
        </button>
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ padding: '8px', background: '#0a1f44', border: '1px solid #00d4ff', color: 'white', borderRadius: '4px' }}>
          <option value={500}>Rất nhanh (0.5s)</option>
          <option value={1000}>Nhanh (1s)</option>
          <option value={2000}>Bình thường (2s)</option>
          <option value={3000}>Chậm (3s)</option>
        </select>
        <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: soundEnabled ? '#00e676' : '#888' }} title="Bật/tắt âm thanh cảnh báo">
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button onClick={exportData} disabled={history.length === 0} title="Xuất dữ liệu CSV">
          📥 Xuất
        </button>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>✍️ Nhập nhanh</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <input 
            type="number" 
            placeholder="Nhập nhịp tim (40-200)" 
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            min="40"
            max="200"
            style={{ width: '180px', padding: '10px', background: '#0a1f44', border: '2px solid #00d4ff', color: 'white', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
          />
          <button onClick={handleManualInput} style={{ background: '#00d4ff', color: '#0a1f44', fontWeight: 'bold' }}>✓ Thêm</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => { setManualInput('55'); setTimeout(handleManualInput, 100); }} style={{ background: '#4fc3f7', fontSize: '12px', padding: '6px 12px' }}>🐢 Chậm (55)</button>
          <button onClick={() => { setManualInput('72'); setTimeout(handleManualInput, 100); }} style={{ background: '#00e676', fontSize: '12px', padding: '6px 12px' }}>✅ Bình thường (72)</button>
          <button onClick={() => { setManualInput('85'); setTimeout(handleManualInput, 100); }} style={{ background: '#ffa726', fontSize: '12px', padding: '6px 12px' }}>🏃 Vận động (85)</button>
          <button onClick={() => { setManualInput('110'); setTimeout(handleManualInput, 100); }} style={{ background: '#ff1744', fontSize: '12px', padding: '6px 12px' }}>⚡ Nhanh (110)</button>
          <button onClick={() => { setManualInput('140'); setTimeout(handleManualInput, 100); }} style={{ background: '#d32f2f', fontSize: '12px', padding: '6px 12px' }}>🔥 Rất nhanh (140)</button>
        </div>
      </div>
      {history.length > 1 && (
        <div className="trend-bar" style={{ marginBottom: '16px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>📈 Xu hướng nhịp tim</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '40px', background: 'linear-gradient(to right, #4fc3f7 0%, #00e676 30%, #00e676 70%, #ff1744 100%)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
              <div 
                className="trend-marker" 
                style={{ 
                  position: 'absolute', 
                  left: `${Math.min(100, Math.max(0, ((parseFloat(avg) - 40) / 160) * 100))}%`, 
                  top: '50%', 
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  background: 'white',
                  border: '3px solid ' + pathology.color,
                  borderRadius: '50%',
                  boxShadow: '0 0 20px ' + pathology.color,
                  animation: 'pulse 1s infinite',
                  zIndex: 10
                }}
              />
            </div>
            <div style={{ minWidth: '80px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: pathology.color }}>
              {avg} bpm
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', opacity: 0.6 }}>
            <span>40 (Chậm)</span>
            <span>72 (Bình thường)</span>
            <span>200 (Nguy hiểm)</span>
          </div>
        </div>
      )}
      {showAlert && (
        <>
          <div 
            className="alert-notification" 
            onClick={() => setShowDetails(true)}
            style={{ background: showAlert.condition === 'tachycardia' ? '#ff1744' : '#4fc3f7' }}
          >
            <div style={{ fontSize: '20px' }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>
                {showAlert.condition === 'tachycardia' ? 'NHỊP TIM CAO' : 'NHỊP TIM THẤP'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{showAlert.avg} bpm - {showAlert.timestamp}</div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowAlert(null); setShowDetails(false); }}
              style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}
            >
              ×
            </button>
          </div>
          {showDetails && (
            <div className="alert-modal" onClick={() => setShowDetails(false)}>
              <div className="alert-content" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ color: showAlert.condition === 'tachycardia' ? '#ff1744' : '#4fc3f7', marginTop: 0 }}>
                  ⚠️ CHI TIẾT CẢNH BÁO
                </h3>
                <p><strong>Tình trạng:</strong> {showAlert.condition === 'tachycardia' ? 'NHỊP TIM CAO (Tachycardia)' : 'NHỊP TIM THẤP (Bradycardia)'}</p>
                <p><strong>Thời gian:</strong> {showAlert.timestamp}</p>
                <p><strong>Nhịp tim:</strong> {showAlert.avg} bpm</p>
                <div style={{ marginTop: '16px', textAlign: 'left' }}>
                  <h4>📋 Bệnh lý có thể có:</h4>
                  {showAlert.condition === 'tachycardia' ? (
                    <ul>
                      <li>Cơn nhịp nhanh kịch phát (SVT)</li>
                      <li>Rung nhĩ/cuồng nhĩ</li>
                      <li>Cường giáp</li>
                      <li>Stress, lo âu, caffeine</li>
                      <li>Sốt, mất nước</li>
                    </ul>
                  ) : (
                    <ul>
                      <li>Nhịp chậm xoang sinh lý</li>
                      <li>Blốc nhĩ thất</li>
                      <li>Hội chứng suy nút xoang</li>
                      <li>Suy giáp</li>
                      <li>Tác dụng phụ thuốc</li>
                    </ul>
                  )}
                  <h4>💊 Cách khắc phục:</h4>
                  {showAlert.condition === 'tachycardia' ? (
                    <ul>
                      <li>✓ Ngồi xuống, thở sâu chậm rãi</li>
                      <li>✓ Làm thủ thuật Valsalva (thở sâu rồi rặn như đi vệ sinh)</li>
                      <li>✓ Rửa mặt bằng nước lạnh</li>
                      <li>✓ Tránh caffeine, rượu, thuốc lá</li>
                      <li>⚕️ Nếu kéo dài &gt;10 phút hoặc có triệu chứng nặng: GỌI CẤP CỨU 115</li>
                    </ul>
                  ) : (
                    <ul>
                      <li>✓ Nằm nghiêng, nâng chân cao</li>
                      <li>✓ Uống nước ấm, giữ ấm cơ thể</li>
                      <li>✓ Tập thể dục nhẹ nhàng (đi bộ)</li>
                      <li>✓ Tránh thuốc giảm nhịp tim</li>
                      <li>⚕️ Nếu kèm chóng mặt, ngất: ĐẾN BỆNH VIỆN NGAY</li>
                    </ul>
                  )}
                </div>
                <button onClick={() => setShowDetails(false)} style={{ marginTop: '16px', width: '100%', padding: '12px', background: '#00e676', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>Đóng</button>
              </div>
            </div>
          )}
        </>
      )}
      {aiInsights && (
        <div className="ai-insights">
          <h4>🤖 Phân tích AI</h4>
          <div className="insight-item">
            <strong>{aiInsights.insight}</strong>
            <p>{aiInsights.recommendation}</p>
          </div>
        </div>
      )}
      {data && (
        <div className="metrics">
          <div style={{ padding: '12px', background: pathology.color + '22', border: `2px solid ${pathology.color}`, borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: pathology.color }}>⚕ TÌNH TRẠNG: {pathology.status}</div>
            <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>Nhịp TB: <strong>{avg} bpm</strong></div>
              <div>Max: <strong style={{ color: '#ff1744' }}>{max} bpm</strong></div>
              <div>Min: <strong style={{ color: '#4fc3f7' }}>{min} bpm</strong></div>
              <div>Rủi ro: <strong style={{ color: data.predictedRisk > 0.5 ? '#ff1744' : '#00e676' }}>{data.predictedRisk}</strong></div>
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a4f" />
                <XAxis dataKey="time" stroke="#888" label={{ value: 'Thời gian (s)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis stroke="#888" label={{ value: 'HR (bpm)', angle: -90, position: 'insideLeft' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip contentStyle={{ background: '#0a1f44', border: `1px solid ${pathology.color}` }} />
                <Line type="monotone" dataKey="hr" stroke={pathology.color} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="sparkline">
            {data.values.map((v, i) => (
              <div key={i} style={{ height: `${Math.min(120, Math.max(40, v))}%` }} title={`${v.toFixed(0)} bpm`} />
            ))}
          </div>
          <div className="heart-grid">
            {data.values.map((v, i) => (
              <div key={i} className="heart-item">
                <div className="heart-value">{v.toFixed(0)}</div>
                <div className={`heart-icon ${v > 100 ? 'fast' : v < 60 ? 'slow' : 'normal'}`}>♥</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {history.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3>📊 Lịch sử đo ({history.length}/20)</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #00d4ff', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#0a1f44', borderBottom: '2px solid #00d4ff' }}>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Thời gian</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Nhịp TB (bpm)</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Rủi ro</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => {
                  const avgNum = parseFloat(item.avg);
                  const color = avgNum > 100 ? '#ff1744' : avgNum < 60 ? '#4fc3f7' : '#00e676';
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #1a3a4f' }}>
                      <td style={{ padding: '8px' }}>{item.time}</td>
                      <td style={{ padding: '8px', textAlign: 'center', color, fontWeight: 'bold' }}>{item.avg}</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: item.risk > 0.5 ? '#ff1744' : '#00e676' }}>{item.risk}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <button onClick={() => setData(item.data)} style={{ padding: '4px 8px', fontSize: '12px' }}>Xem</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Section>
  );
}

function FLPanel() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await simulateFL({ clients: 5, rounds: 8 });
      setRounds(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runSim(); }, []);

  const lossChartData = useMemo(() => {
    return rounds.map(r => ({
      round: r.round,
      globalLoss: parseFloat(r.globalLoss.toFixed(4)),
      clientLoss: parseFloat(r.clientLoss.toFixed(4))
    }));
  }, [rounds]);

  return (
    <Section title="Tiến trình Federated Learning (FedAvg)">
      <button onClick={runSim} disabled={loading}>{loading ? 'Đang chạy...' : 'Chạy mô phỏng'}</button>
      {rounds.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lossChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a4f" />
              <XAxis dataKey="round" stroke="#888" label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }} />
              <YAxis stroke="#888" label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a1f44', border: '1px solid #00d4ff', borderRadius: '4px' }}
                formatter={(value) => value.toFixed(4)}
              />
              <Line type="monotone" dataKey="globalLoss" stroke="#00d4ff" dot={{ r: 4, fill: '#00d4ff' }} strokeWidth={2} name="Global Loss" />
              <Line type="monotone" dataKey="clientLoss" stroke="#ff6b9d" dot={{ r: 4, fill: '#ff6b9d' }} strokeWidth={2} name="Client Loss" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Section>
  );
}

export default function App() {
  const [status, setStatus] = useState('Đang kiểm tra backend...');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    checkStatus().then(setStatus).catch(() => setStatus('Backend chưa sẵn sàng'));
  }, []);
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`page ${theme}`}>
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="eyebrow">🏥 Federated Health Monitoring System</p>
            <h1>Hệ thống theo dõi sức khỏe phân tán</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
              <span className={`status-badge ${status.includes('running') || status.includes('Backend') ? 'online' : 'offline'}`}>
                {status.includes('running') || status.includes('Backend') ? '🟢 Online' : '🔴 Offline'}
              </span>
              <span className="tech-badge">☕ Java + Spring Boot</span>
              <span className="tech-badge">⚛️ React + Vite</span>
              <span className="tech-badge">🤖 FL + LSTM</span>
            </div>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="theme-toggle"
            title="Chuyển đổi giao diện"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main>
        <HeartRatePanel />
        <FLPanel />
      </main>
      <footer style={{ textAlign: 'center', padding: '20px', opacity: 0.7, fontSize: '14px' }}>
        <p>💡 Powered by FedAvg Algorithm | Privacy-Preserving Machine Learning</p>
        <p>© 2025 Federated Health Monitoring System</p>
      </footer>
    </div>
  );
}
