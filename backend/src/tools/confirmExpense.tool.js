import {
    getConversation,
    clearPendingExpense,
    setAwaitingConfirmation
  } from "../conversation/conversation.store.js";
  
  import addExpense from "./addExpense.tool.js";
  
  const confirmExpense = async (conversationId) => {
    const conversation = getConversation(conversationId);
  
    if (!conversation.awaitingConfirmation) {
      return {
        success: false,
        message: "There is no expense waiting for confirmation."
      };
    }
  
    if (!conversation.pendingExpense) {
      return {
        success: false,
        message: "There is no pending expense to add."
      };
    }
  
    const savedExpense = await addExpense(
      conversation.pendingExpense
    );
  
    clearPendingExpense(conversationId);
    setAwaitingConfirmation(
      conversationId,
      false
    );
  
    return {
      success: true,
      message: "Expense added successfully.",
      expense:savedExpense
    };
  };
  
  export default confirmExpense;