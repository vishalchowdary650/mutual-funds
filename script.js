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
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center">
        <h4>${f.name}</h4>
        <span class="badge">${f.type}</span>
      </div>
      <p style="color: #444; margin:8px 0">${f.description}</p>
      <div><strong>1Y:</strong> ${formatPct(f.performance['1y'])} &nbsp; <strong>3Y:</strong> ${formatPct(f.performance['3y'])}</div>
      <div class="controls">
        <a class="button" href="pages/investor.html">Open</a>
        <button class="button" onclick="addToCompare('${f.id}')">Compare</button>
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
}

function renderCompareChart(){
  const labels = [];
  const datasets = [];
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
  window._chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '1Y Return (%)',
        data: data1y,
      }]
    },
    options: {
      responsive: true,
      scales:{ y:{ beginAtZero:true } }
    }
  });
}

loadFunds();
