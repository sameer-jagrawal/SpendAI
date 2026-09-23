import ExpenseResult from "../Expense/ExpenseResult";
import ExpenseList from "../Expense/ExpenseList";
import SummaryResult from "../Expense/SummaryResult";
export default function Message({
  role,
  content,
  toolResults = []
}) {
  const isUser = role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      {!isUser && (
        <div className="message-avatar">
          S
        </div>
      )}

      <div className="message-content">
        <div className="message-bubble">
          {content}
        </div>

        {!isUser &&
          toolResults.map((toolResult, index) => {
            if (toolResult.tool === "confirmExpense") {
              return (
                <ExpenseResult
                  key={`${toolResult.tool}-${index}`}
                  result={toolResult.result}
                />
              );
            }
            if (toolResult.tool === "getExpenses") {
                return (
                  <ExpenseList
                    key={`${toolResult.tool}-${index}`}
                    result={toolResult.result}
                  />
                );
              }

            if (toolResult.tool === "getExpenseSummary") {
                return (
                  <SummaryResult
                    key={`${toolResult.tool}-${index}`}
                    result={toolResult.result}
                  />
                );
              }
  
            return null;
          })}
      </div>
    </div>
  );
}
