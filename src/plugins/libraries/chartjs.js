/**
 * Chart.js Integration Plugin
 */
export function renderChartJs(props) {
  const propsObj = Object.create(null);
  props.forEach(p => {
    const key = p.key.replace(':', '');
    propsObj[key] = p.value;
  });

  const type = propsObj.type || 'bar';
  const labelsStr = propsObj.labels || '';
  const dataStr = propsObj.data || '';

  const labels = labelsStr.split('|').map(s => `'${s.trim()}'`).join(', ');
  const data = dataStr.split('|').map(s => s.trim()).join(', ');

  const canvasId = `chart-${Math.random().toString(36).substr(2, 9)}`;

  const html = `<div class="aether-chart-container"><canvas id="${canvasId}"></canvas></div>`;

  const script = `
(function() {
  const ctx = document.getElementById('${canvasId}').getContext('2d');
  new Chart(ctx, {
    type: '${type}',
    data: {
      labels: [${labels}],
      datasets: [{
        label: 'AetherML Data',
        data: [${data}],
        borderWidth: 1,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
})();
  `.trim();

  return { html, script };
}
