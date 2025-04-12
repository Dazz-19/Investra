window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const stockSymbol = params.get('stock')?.toUpperCase() || 'TSLA';

  try {
    const res = await fetch('stock_data_offline.json');
    const data = await res.json();

    const stock = data[stockSymbol] || data['TSLA'];

    // 🟩 Update stock details
    document.getElementById('stockSymbol').textContent = stockSymbol;
    document.getElementById('detailCompany').textContent = stock.name;
    document.getElementById('detailPrice').textContent = stock.price;
    document.getElementById('detailChange').textContent = stock.change;
    document.getElementById('detailVolume').textContent = stock.volume;
    document.getElementById('detailMarketCap').textContent = stock.marketCap;

    // 📊 Create the chart
    const ctx = document.getElementById('stockChart').getContext('2d');
    const prices = stock.history;
    const labels = prices.map((_, i) => `Day ${i + 1}`);

    // Dynamic green/red border color
    const borderColors = prices.map((price, i, arr) => {
      if (i === 0) return 'rgba(0,255,0,0.9)';
      return price >= arr[i - 1] ? 'rgba(0,255,0,0.9)' : 'rgba(255,0,0,0.9)';
    });

    const pointColors = borderColors;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${stockSymbol} Price`,
          data: prices,
          borderColor: borderColors,
          pointBackgroundColor: pointColors,
          backgroundColor: 'rgba(94, 53, 177, 0.2)',
          fill: true,
          pointRadius: 4,
          tension: 0 // 🚫 Disable curve bounce
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0 // 🚫 Disable animation
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#ccc',
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#bbb'
            },
            grid: {
              color: 'rgba(255,255,255,0.05)'
            },
            title: {
              display: true,
              text: 'Day',
              color: '#ccc'
            }
          },
          y: {
            ticks: {
              color: '#bbb'
            },
            grid: {
              color: 'rgba(255,255,255,0.05)'
            },
            title: {
              display: true,
              text: 'Price',
              color: '#ccc'
            }
          }
        }
      }
    });

    // 🟨 Compare With Cards
    const compareContainer = document.getElementById('compareCards');
    compareContainer.innerHTML = '';

    const comparisonSymbols = Object.keys(data)
      .filter(key => key !== stockSymbol)
      .slice(0, 4); // Pick top 4 others

    comparisonSymbols.forEach(symbol => {
      const s = data[symbol];
      const isPositive = s.change.includes('↑');
      const priceMatch = s.price.match(/₹?\$?([\d,.]+)/)?.[0] || s.price;
      const percentMatch = s.change.match(/\(([^)]+)\)/)?.[1] || '';

      const card = document.createElement('div');
      card.className = `compare-card ${isPositive ? 'green' : 'red'}`;
      card.innerHTML = `
        <strong>${symbol}</strong><br>
        ${priceMatch}<br>
        ${isPositive ? '↑' : '↓'} ${percentMatch}
      `;
      compareContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load offline data:', err);
    alert('Stock data could not be loaded. Please try again.');
  }
});
