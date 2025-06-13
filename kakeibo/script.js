document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const totalAmount = document.getElementById("total-amount");
  const clearButton = document.getElementById("clear-button");
const cancelButton = document.getElementById("cancel-button");


  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let editingIndex = null; // ← 編集中のインデックスを覚える用

  function saveExpenses() {
    console.log("保存中：", expenses);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function renderExpenses() {
    console.log("読み込み時：", expenses);
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
  groupedByMonth[month][day].forEach(exp => {
    monthTotal += parseFloat(exp.amount);
  });
}

const monthTotalElem = document.createElement("p");
monthTotalElem.textContent = `合計：¥${monthTotal.toLocaleString()}`;
monthTotalElem.style.fontWeight = "bold";
monthTotalElem.style.marginBottom = "10px";
monthDiv.appendChild(monthTotalElem);

      for (const day in groupedByMonth[month]) {
        const dayDiv = document.createElement("div");
        const dayTitle = document.createElement("h4");
        dayTitle.textContent = day;
        dayDiv.appendChild(dayTitle);

        groupedByMonth[month][day].forEach(exp => {
          const item = document.createElement("li");
          item.textContent = `${exp.name}: ¥${exp.amount}（${exp.memo}）`;

          const deleteBtn = document.createElement("button");
deleteBtn.textContent = "削除";
deleteBtn.style.marginLeft = "10px";
deleteBtn.addEventListener("click", () => {
  // 該当データだけ削除
  expenses = expenses.filter(e => e !== exp);
  saveExpenses();
  renderExpenses();
});

  // 編集ボタン
const editBtn = document.createElement("button");
editBtn.textContent = "編集";
editBtn.style.marginLeft = "5px";
editBtn.addEventListener("click", () => {
  // フォームに値をセット
  document.getElementById("expense-name").value = exp.name;
  document.getElementById("expense-amount").value = exp.amount;
  document.getElementById("expense-memo").value = exp.memo;
  document.getElementById("expense-date").value = exp.date;

  // 編集対象としてマーク（インデックス記録）
  editingIndex = expenses.indexOf(exp);
  cancelButton.style.display = "inline";
});

item.appendChild(editBtn);
item.appendChild(deleteBtn);
          dayDiv.appendChild(item);
          total += parseFloat(exp.amount);
        });

        monthDiv.appendChild(dayDiv);
      }

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
    // 編集モードなら上書き
    expenses[editingIndex] = expense;
    editingIndex = null;
  } else {
    // 通常の追加モード
    expenses.push(expense);
      expenseForm.reset();
  cancelButton.style.display = "none";
    saveExpenses();
  renderExpenses();
  }

  saveExpenses();
  renderExpenses();
  expenseForm.reset();
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
  document.addEventListener("DOMContentLoaded", () => {
  // ...すでにあるコードの中略...

  cancelButton.addEventListener("click", () => {
    expenseForm.reset();
    editingIndex = null;
    cancelButton.style.display = "none";
  });


});

});
  renderExpenses();
});
