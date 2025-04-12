const stockSymbols = ['TSLA', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'LT', 'KOTAKBANK'];

async function displayStocks() {
  const table = document.getElementById("stockTable");
  table.innerHTML = '';

  try {
    const res = await fetch('stock_data_offline.json');
    const data = await res.json();

    stockSymbols.forEach(symbol => {
      const stock = data[symbol];
      if (!stock) return;

      const row = document.createElement('tr');
      const numericChange = parseFloat(stock.change.match(/[-+]?[\d.]+/)[0]);
      const percentMatch = stock.change.match(/\\(([^)]+)\\)/);
      const percent = percentMatch ? percentMatch[1] : '';

      const changeClass = numericChange >= 0 ? 'green' : 'red';

      row.innerHTML = `
        <td><span class="logo blue">${symbol}</span></td>
        <td>${stock.name}</td>
        <td>${stock.price}</td>
        <td class="${changeClass}">${numericChange > 0 ? '+' : ''}${numericChange.toFixed(2)}</td>
        <td class="${changeClass}">${percent}</td>
      `;
      row.addEventListener('click', () => redirectToDetail(symbol));
      table.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading stock data:', err);
    alert('Unable to load offline stock data.');
  }
}

function redirectToDetail(symbol) {
  window.location.href = 'stock-detail.html?stock=' + encodeURIComponent(symbol);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  const themeBtn = document.querySelector('#userDropdown button');
  if (themeBtn) {
    themeBtn.textContent = isDark ? '🌙 Light Mode' : '☀️ Dark Mode';
  }
}

function handleSearch() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#stockTable tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? '' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', displayStocks);
