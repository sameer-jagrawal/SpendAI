import runSpendAIAgent from "../agent/spendAI.agent.js";

const askLLM = async (userMessage, conversationId) => {
  return await runSpendAIAgent(userMessage, conversationId);
};

export default askLLM;
