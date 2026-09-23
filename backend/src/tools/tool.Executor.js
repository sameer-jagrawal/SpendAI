import { getConversation } from "../conversation/conversation.store.js";
import addExpense from "./addExpense.tool.js";
import getExpenses from "./getExpenses.tool.js";
import getExpenseSummary from "./getExpenseSummary.tool.js";
import prepareExpense from "./prepareExpense.tool.js";
import confirmExpense from "./confirmExpense.tool.js";
import cancelExpense from "./cancelExpense.tool.js";
import getLatestExpense from "./getLatestExpense.tool.js";

const toolExecutor = async (toolName, args, conversationId) => {
  switch (toolName) {
    case "confirmExpense":
      return confirmExpense(conversationId);

    case "cancelExpense":
      return cancelExpense(conversationId);

    case "prepareExpense":
      return await prepareExpense(args, conversationId);

    case "addExpense":
      const conversation = getConversation(conversationId);
      if (!conversation.awaitingConfirmation) {
        return {
          success: false,
          message: "Expense cannot be added without confirmation.",
        };
      }

      return addExpense(args);

    case "getExpenses":
      return await getExpenses(args);

    case "getLatestExpense":
      return await getLatestExpense();

    case "getExpenseSummary":
      return await getExpenseSummary(args);

    default:
      throw new Error(`Unknown tool ${toolName}`);
  }
};

export default toolExecutor;
