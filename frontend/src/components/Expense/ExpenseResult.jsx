
export default function ExpenseResult({ result }) {
  console.log(result, "expense result")
  if (!result?.success) {
    return null;
  }

  const expense = result?.expense || []

  return (
    <div className="expense-result">
      <div className="expense-result-header">
        <div className="expense-result-check">✓</div>

        <div>
          <div className="expense-result-title">
            Expense added
          </div>

          <div className="expense-result-subtitle">
            Saved successfully
          </div>
        </div>
      </div>

      <div className="expense-result-amount">
        ₹{expense.amount}
      </div>

      <div className="expense-result-details">
        <div>
          <span className="expense-detail-label">Merchant</span>
          <span>{expense.merchant || "Not specified"}</span>
        </div>

        <div>
          <span className="expense-detail-label">Category</span>
          <span>{expense.category}</span>
        </div>
      </div>
    </div>
  );
}
