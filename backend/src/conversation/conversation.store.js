const conversations = new Map();

const getConversation = (conversationId) => {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      messages: [],
      pendingExpense: null,
      awaitingConfirmation:false
    });
  }

  return conversations.get(conversationId);
};

const addMessage = (conversationId, message) => {
  const conversation = getConversation(conversationId);

  conversation.messages.push(message);
};

const setPendingExpense = (
  conversationId,
  expense
) => {
  const conversation = getConversation(conversationId);

  conversation.pendingExpense = expense;
};

const clearPendingExpense = (conversationId) => {
  const conversation = getConversation(conversationId);

  conversation.pendingExpense = null;
};

const setAwaitingConfirmation = (
    conversationId,
    value
  ) => {
    const conversation = getConversation(conversationId);
  
    conversation.awaitingConfirmation = value;
  };
  
export {
  getConversation,
  addMessage,
  setPendingExpense,
  clearPendingExpense,
  setAwaitingConfirmation
};