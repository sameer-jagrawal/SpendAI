import {
    clearPendingExpense,
    setAwaitingConfirmation
  } from "../conversation/conversation.store.js";
  
  const cancelExpense = (conversationId) => {
    clearPendingExpense(conversationId);
  
    setAwaitingConfirmation(
      conversationId,
      false
    );
  
    return {
      success: true,
      message: "Pending expense cancelled."
    };
  };
  
  export default cancelExpense;