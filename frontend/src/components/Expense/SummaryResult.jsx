export default function SummaryResult({ result }) {
  if (!result?.success) {
    return null;
  }

  const categories = Object.entries(
    result.categoryBreakdown || {}
  );

  const periodLabel = {
    today: "Today",
    week: "Last 7 days",
    month: "This month",
    all: "All time"
  };

  return (
    <div className="summary-result">
      <div className="summary-header">
        <div>
          <div className="summary-title">
            Spending summary
          </div>

          <div className="summary-period">
            {periodLabel[result.period] || result.period}
          </div>
        </div>
      </div>

      <div className="summary-total">
        ₹{result.totalAmount}
      </div>

      <div className="summary-count">
        {result.expenseCount}{" "}
        {result.expenseCount === 1
          ? "expense"
          : "expenses"}
      </div>

      {categories.length > 0 && (
        <div className="summary-categories">
          {categories.map(([category, amount]) => {
            const percentage =
              result.totalAmount > 0
                ? (amount / result.totalAmount) * 100
                : 0;

            return (
              <div
                className="summary-category"
                key={category}
              >
                <div className="summary-category-top">
                  <span>{category}</span>

                  <span>
                    ₹{amount}
                  </span>
                </div>

                <div className="summary-bar">
                  <div
                    className="summary-bar-fill"
                    style={{
                      width: `${percentage}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {categories.length === 0 && (
        <div className="summary-empty">
          No category data available.
        </div>
      )}
    </div>
  );
}
