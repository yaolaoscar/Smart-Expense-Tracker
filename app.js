// Initialize
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
const form = document.getElementById('expense-form');
const tbody = document.querySelector('#expense-table tbody');
const totalDisplay = document.getElementById('total');
const ctx = document.getElementById('expenseChart').getContext('2d');
let chart;

// Add Expense
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!description || !amount || !category) {
    alert("Please fill all fields before adding an expense.");
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    category,
    date: new Date().toLocaleDateString()
  };

  // Add to list & save
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  // Update UI
  renderTable();
  updateChart();
  form.reset(); // ✅ Clears form for next entry
});

// Render Expense Table
function renderTable() {
  tbody.innerHTML = '';

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No expenses yet</td></tr>`;
  }

  expenses.forEach((exp) => {
    const row = document.createElement('tr');
    row.dataset.id = exp.id;
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.description}</td>
      <td>${exp.category}</td>
      <td>${exp.amount.toFixed(2)}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  updateTotal();
}

// Delete Expense (using event delegation)
tbody.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const row = e.target.closest('tr');
    const id = Number(row.dataset.id);
    expenses = expenses.filter((exp) => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderTable();
    updateChart();
  }
});

// Update Total
function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalDisplay.textContent = total.toFixed(2);
}

// Update Chart
function updateChart() {
  const categoryTotals = {};

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: 'Spending by Category',
          data: Object.values(categoryTotals),
          backgroundColor: ['#00796b', '#4caf50', '#fbc02d', '#e64a19', '#9575cd']
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Initialize app when page loads
renderTable();
updateChart();
