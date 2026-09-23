import {
    getConversation,
    setPendingExpense
  } from "../conversation/conversation.store.js";
  
  const prepareExpense = async (
    args,
    conversationId
  ) => {
    const conversation =
      getConversation(conversationId);
  
    const existingExpense =
      conversation.pendingExpense || {};
  
    const pendingExpense = {
      amount:
        args.amount ?? existingExpense.amount ?? null,
  
      currency:
        args.currency ??
        existingExpense.currency ??
        "INR",
  
      category:
        args.category ??
        existingExpense.category ??
        null,
  
      merchant:
        args.merchant ??
        existingExpense.merchant ??
        null,
  
      description:
        args.description ??
        existingExpense.description ??
        null,
  
      date:
        args.date ??
        existingExpense.date ??
        null,
  
      source:
        args.source ??
        existingExpense.source ??
        "voice"
    };
  
    setPendingExpense(
      conversationId,
      pendingExpense
    );
  
    const missingFields = [];
  
    if (pendingExpense.amount === null) {
      missingFields.push("amount");
    }
  
    if (!pendingExpense.category) {
      missingFields.push("category");
    }
  
    if (!pendingExpense.date) {
      missingFields.push("date");
    }
  
    return {
      success: true,
      pendingExpense,
      complete: missingFields.length === 0,
      missingFields
    };
  };
  
  export default prepareExpense;