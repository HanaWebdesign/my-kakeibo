document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const totalAmount = document.getElementById("total-amount");
  const clearButton = document.getElementById("clear-button");
  const cancelButton = document.getElementById("cancel-button");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let editingIndex = null;

  function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function renderExpenses() {
    expenseList.innerHTML = "";
    const groupedByMonth = {};
    let total = 0;

    expenses.forEach(expense => {
      if (!expense.date || !expense.name) return;
      const date = new Date(expense.date);
      if (isNaN(date)) return;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const monthKey = `${year}年${month}月`;
      const dayKey = `${day}日`;

      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = {};
      if (!groupedByMonth[monthKey][dayKey]) groupedByMonth[monthKey][dayKey] = [];

      groupedByMonth[monthKey][dayKey].push(expense);
    });

    for (const month in groupedByMonth) {
      const monthDiv = document.createElement("div");
      const monthTitle = document.createElement("h3");
      monthTitle.textContent = month;
      monthDiv.appendChild(monthTitle);

      let monthTotal = 0;

      for (const day in groupedByMonth[month]) {
        const dayDiv = document.createElement("div");
        const dayTitle = document.createElement("h4");
        dayTitle.textContent = day;
        dayDiv.appendChild(dayTitle);

        groupedByMonth[month][day].forEach(exp => {
          const item = document.createElement("li");
          item.style.display = "flex";
          item.style.justifyContent = "space-between";
          item.style.alignItems = "center";
          item.style.marginBottom = "6px";

          const textSpan = document.createElement("span");
          textSpan.textContent = `${exp.name}: ¥${exp.amount}（${exp.memo}）`;

          const editBtn = document.createElement("button");
          editBtn.textContent = "編集";
          editBtn.addEventListener("click", () => {
            document.getElementById("expense-name").value = exp.name;
            document.getElementById("expense-amount").value = exp.amount;
            document.getElementById("expense-memo").value = exp.memo;
            document.getElementById("expense-date").value = exp.date;
            editingIndex = expenses.indexOf(exp);
            cancelButton.style.display = "inline";
          });

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "削除";
          deleteBtn.addEventListener("click", () => {
            expenses = expenses.filter(e => e !== exp);
            saveExpenses();
            renderExpenses();
          });

          const buttonWrapper = document.createElement("span");
          buttonWrapper.style.display = "inline-flex";
          buttonWrapper.style.gap = "6px";
          buttonWrapper.appendChild(editBtn);
          buttonWrapper.appendChild(deleteBtn);
          buttonWrapper.style.marginLeft = "10px";
buttonWrapper.style.flexShrink = "0"; // 折り返し防止

          item.appendChild(textSpan);
          item.appendChild(buttonWrapper);
          dayDiv.appendChild(item);

          monthTotal += parseFloat(exp.amount);
          total += parseFloat(exp.amount);
        });

        monthDiv.appendChild(dayDiv);
      }

      const monthTotalElem = document.createElement("p");
      monthTotalElem.textContent = `【${month} の合計：¥${monthTotal.toLocaleString()}】`;
      monthTotalElem.style.fontWeight = "bold";
      monthTotalElem.style.marginTop = "10px";
      monthDiv.appendChild(monthTotalElem);

      expenseList.appendChild(monthDiv);
    }

    totalAmount.textContent = total;
  }

  expenseForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("expense-name").value;
    const amount = document.getElementById("expense-amount").value;
    const memo = document.getElementById("expense-memo").value;
    const date = document.getElementById("expense-date").value;

    const expense = { name, amount, memo, date };

    if (editingIndex !== null) {
      expenses[editingIndex] = expense;
      editingIndex = null;
      cancelButton.style.display = "none";
    } else {
      expenses.push(expense);
    }

    expenseForm.reset();
    saveExpenses();
    renderExpenses();
  });

  clearButton.addEventListener("click", () => {
    if (confirm("本当にすべてのデータを削除しますか？")) {
      localStorage.removeItem("expenses");
      expenses = [];
      renderExpenses();
    }
  });

  cancelButton.addEventListener("click", () => {
    expenseForm.reset();
    editingIndex = null;
    cancelButton.style.display = "none";
  });

  renderExpenses();
});