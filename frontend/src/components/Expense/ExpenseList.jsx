export default function ExpenseList({ result }) {
  if (!result?.success || !result.expenses?.length) {
    return (
      <div className="expense-list-empty">
        No expenses found.
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <span>Recent expenses</span>
        <span>{result.count}</span>
      </div>

      <div className="expense-list-items">
        {result.expenses.map((expense) => (
          <div
            className="expense-list-item"
            key={expense._id}
          >
            <div className="expense-list-main">
              <div className="expense-list-merchant">
                {expense.merchant || "Unknown merchant"}
              </div>

              <div className="expense-list-meta">
                <span>{expense.category}</span>

                <span>•</span>

                <span>
                  {new Date(expense.date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }
                  )}
                </span>
              </div>
            </div>

            <div className="expense-list-amount">
              ₹{expense.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
