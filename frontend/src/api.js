const apiBase = '/api';

// Generate realistic ECG-like data with pathologies
function generateECGData(points = 60) {
  const values = [];
  const conditions = ['normal', 'bradycardia', 'tachycardia', 'arrhythmia', 'normal'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  let baseHR;
  switch(condition) {
    case 'bradycardia': baseHR = 55 + Math.random() * 5; break;
    case 'tachycardia': baseHR = 105 + Math.random() * 15; break;
    case 'arrhythmia': baseHR = 68 + Math.random() * 12; break;
    default: baseHR = 72 + Math.random() * 10;
  }
  
  const hasArrhythmia = condition === 'arrhythmia';
  
  for (let i = 0; i < points; i++) {
    const phase = (i % 20) / 20.0;
    let ecgValue = 0;
    
    // QRS complex (sharp spike)
    if (phase > 0.3 && phase < 0.35) {
      ecgValue = baseHR + (phase - 0.3) / 0.05 * 40;
    } else if (phase >= 0.35 && phase < 0.4) {
      ecgValue = baseHR + 40 - (phase - 0.35) / 0.05 * 40;
    }
    // T wave
    else if (phase > 0.5 && phase < 0.65) {
      ecgValue = baseHR + Math.sin((phase - 0.5) / 0.15 * Math.PI) * 8;
    }
    // Baseline
    else {
      ecgValue = baseHR + (Math.random() - 0.5) * 4;
    }
    
    // Add irregular beats
    if (hasArrhythmia && Math.random() < 0.08) {
      ecgValue += (Math.random() - 0.5) * 30;
    }
    
    values.push(Math.round(ecgValue * 100) / 100);
  }
  
  let riskScore = 0;
  if (baseHR < 60) riskScore += 0.3;
  if (baseHR > 100) riskScore += 0.5;
  if (hasArrhythmia) riskScore += 0.4;
  
  return {
    values,
    predictedRisk: Math.min(1.0, Math.round(riskScore * 100) / 100)
  };
}

export async function fetchHeartbeat(points = 60) {
  // Try real API first, fallback to mock data
  try {
    const res = await fetch(`${apiBase}/heartbeat?points=${points}`);
    if (!res.ok) throw new Error('Backend unavailable');
    return res.json();
  } catch {
    // Return mock ECG data with realistic patterns
    return generateECGData(points);
  }
}

export async function simulateFL(payload = { clients: 5, rounds: 8 }) {
  const res = await fetch(`${apiBase}/fl/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to run simulation');
  return res.json();
}

export async function checkStatus() {
  const res = await fetch(`${apiBase}/status`);
  if (!res.ok) throw new Error('Backend unavailable');
  return res.text();
}
