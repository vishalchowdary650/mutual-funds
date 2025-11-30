// script.js - load sample fund data and render UI + chart
async function loadFunds(){
  try{
    const res = await fetch('data/funds.json');
    const funds = await res.json();
    renderFunds(funds);
    window.allFunds = funds;
  }catch(e){
    document.getElementById('funds-list').innerText = 'Failed to load sample data.';
    console.error(e);
  }
}

function renderFunds(funds){
  const container = document.getElementById('funds-list');
  container.innerHTML = '';
  funds.forEach(f=>{
    const div = document.createElement('div');
    div.className = 'card';
    const badgeClass = f.type.toLowerCase().replace(/\s+/g, '-');
    const return1y = f.performance['1y'];
    const return3y = f.performance['3y'];
    const returnColor1y = return1y >= 0 ? '#059669' : '#dc2626';
    const returnColor3y = return3y >= 0 ? '#059669' : '#dc2626';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px">
        <h4 style="flex:1; padding-right:12px">${f.name}</h4>
        <span class="badge ${badgeClass}">${f.type}</span>
      </div>
      <p style="color:#64748b; margin:0 0 16px 0; font-size:14px; line-height:1.5">${f.description}</p>
      <div style="display:flex; gap:20px; margin-bottom:16px; padding:12px; background:#f8fafc; border-radius:10px">
        <div style="text-align:center; flex:1">
          <div style="font-size:12px; color:#64748b; margin-bottom:4px">1Y Return</div>
          <div style="font-size:18px; font-weight:700; color:${returnColor1y}">${formatPct(return1y)}</div>
        </div>
        <div style="width:1px; background:#e2e8f0"></div>
        <div style="text-align:center; flex:1">
          <div style="font-size:12px; color:#64748b; margin-bottom:4px">3Y Return</div>
          <div style="font-size:18px; font-weight:700; color:${returnColor3y}">${formatPct(return3y)}</div>
        </div>
      </div>
      <div class="controls">
        <a class="button" href="pages/investor.html">Details</a>
        <button class="button secondary" onclick="addToCompare('${f.id}')">${compareIds.has(f.id) ? 'Remove' : 'Compare'}</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function formatPct(n){ return (n>=0?'+':'') + (n*100).toFixed(2) + '%' }

const compareIds = new Set();
function addToCompare(id){
  if(compareIds.has(id)) compareIds.delete(id); else compareIds.add(id);
  renderCompareChart();
  // Re-render fund cards to update button text
  if(window.allFunds) renderFunds(window.allFunds);
}

function renderCompareChart(){
  const labels = [];
  const selected = Array.from(compareIds).slice(0,6);
  selected.forEach(id=>{
    const f = window.allFunds.find(x=>x.id===id);
    if(!f) return;
    labels.push(f.name);
  });
  const data1y = selected.map(id => {
    const f = window.allFunds.find(x=>x.id===id);
    return Math.round((f?.performance['1y']||0)*100);
  });
  const ctx = document.getElementById('compareChart').getContext('2d');
  if(window._chart) window._chart.destroy();

  // Generate gradient colors for bars
  const gradientColors = data1y.map((value, index) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    if(value >= 0) {
      gradient.addColorStop(0, 'rgba(30, 64, 175, 0.9)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.7)');
    } else {
      gradient.addColorStop(0, 'rgba(220, 38, 38, 0.9)');
      gradient.addColorStop(1, 'rgba(248, 113, 113, 0.7)');
    }
    return gradient;
  });

  window._chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '1Y Return (%)',
        data: data1y,
        backgroundColor: gradientColors,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { family: 'Inter', size: 13, weight: '500' },
            color: '#1e293b'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font: { family: 'Inter', size: 12 },
            color: '#64748b',
            callback: function(value) { return value + '%'; }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { family: 'Inter', size: 12 },
            color: '#1e293b'
          }
        }
      }
    }
  });
}

loadFunds();
