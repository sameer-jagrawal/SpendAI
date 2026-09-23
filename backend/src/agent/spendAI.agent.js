import OpenAI from "openai";
import toolDefinitions from "../tools/toolDefinations.js";
import toolExecutor from "../tools/tool.Executor.js";
import {
  getConversation,
  addMessage,
  setAwaitingConfirmation,
  clearPendingExpense,
} from "../conversation/conversation.store.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date(),
  );
};

const runSpendAIAgent = async (userMessage, conversationId) => {
  const conversation = getConversation(conversationId);

  const today = getToday();

  addMessage(conversationId, {
    role: "user",
    content: userMessage,
  });
  let response = await openai.responses.create({
    model: "gpt-5.6-luna",

    instructions: `
  You are SpendAI, an expense management assistant.

  Today's date is ${today}.
  The user's timezone is Asia/Kolkata.

  Current pending expense:
  ${JSON.stringify(conversation.pendingExpense)}

  Current confirmation state:
  ${conversation.awaitingConfirmation}

  EXPENSE ACTION RULE:

First check the current confirmation state.

If the current confirmation state is true:
- The user is responding to the confirmation question.
- Do NOT use prepareExpense.
- Do NOT use addExpense.
- If the user agrees, call confirmExpense.
- If the user rejects the expense, do not call any expense-saving tool.

Only when the current confirmation state is false should you use prepareExpense
to collect or update expense information.

If there is no confirmation pending and the user provides expense information,
use prepareExpense.
  Do not save an expense using addExpense yet.

  An expense must first be prepared and completed.

  If required information is missing, ask the user for
  the missing information.

  Do not claim that an expense has been recorded, added, saved, or stored
  unless the addExpense tool has actually been called successfully.

  prepareExpense only prepares or updates an expense.
  It does NOT save anything to the database.

  When a pending expense becomes complete, do NOT call addExpense yet.
  Instead, ask the user for confirmation.

 

CONFIRMATION ACTION:

If the current confirmation state is true, the user is responding to the expense confirmation question.

If the user clearly agrees to add the expense, such as:
- "yes"
- "yeah"
- "yep"
- "sure"
- "go ahead"
- "add it"
- "do it"
- "save it"

then call the confirmExpense tool.

Do NOT call prepareExpense when the user is confirming an already prepared expense.

If the current confirmation state is true and the user clearly rejects
the pending expense, call the cancelExpense tool.

Examples of rejection:
- "no"
- "cancel"
- "don't add it"
- "no thanks"
- "don't save it"
- "forget it"

Do not call prepareExpense or addExpense when the user rejects
the pending expense.

CONFIRMATION RULES:

If the tool result is from confirmExpense and it succeeded:
- Tell the user that the expense was added.
- Do not ask for confirmation again.
- Do not call prepareExpense.
- Do not call confirmExpense again.

When asking for confirmation:
- Never say "Please confirm".
- Never say "record".
- Never say "database".
- Never say "entry".
- Never say "transaction".
- Never say "dated".
- Never describe the expense like a system command.
- Do not expose internal field names such as amount, category, merchant, date, or source.
- Speak as a friendly personal expense assistant.
- Briefly acknowledge what the user told you.
- Restate the important details naturally.
- Ask whether the user wants you to add it to their expenses.

Preferred style:
"I got it — you spent ₹300 on a Zone Burger at Domino’s today. Should I add this to your expenses?"

Other acceptable styles:
"Got it — ₹300 for a Zone Burger at Domino’s today. Would you like me to add that to your expenses?"

"Okay, I have ₹300 for a Zone Burger at Domino’s today. Should I add it to your expenses?"

Never produce:
"Please confirm: record ₹300 for a Zone Burger at Domino’s under Food, dated today, September 19, 2026."

EXPENSE HISTORY:

When the user asks to see, show, list, or know about their recent
saved expenses, use the getExpenses tool.

When the user asks for only their single most recently created expense,
use getLatestExpense.

Examples:
- "What did I spend recently?"
- "Show my recent expenses."
- "What were my last expenses?"
- "Show me my last 5 expenses."
- "What have I spent lately?"

Examples for getLatestExpense:
- "Show me my most recent expense."
- "What was my latest expense?"
- "What was the last expense I created?"
- "Show my newest expense."

Do not use prepareExpense for these requests.
Do not create or modify an expense when the user is only asking
to view existing expenses.

  Date rules:
  - "today" means ${today}.
  - "yesterday" means the calendar date one day before ${today}.
  - "tomorrow" means the calendar date one day after ${today}.
  - When preparing an expense, use the actual date
    in YYYY-MM-DD format.

  Response style:
  - Use simple, natural, human language.
  - Do not use Markdown.
  - Do not use asterisks, bullet points, headings, or tables.
  - Keep responses concise.
  - Make responses suitable for both displaying and text-to-speech.
`,

    input: conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    tools: toolDefinitions,
  });

  // Store information about tools executed during this request
  const toolResults = [];

  while (true) {
    const toolCalls = response.output.filter(
      (item) => item.type === "function_call",
    );

    if (toolCalls.length === 0) {
      addMessage(conversationId, {
        role: "assistant",
        content: response.output_text,
      });

      return {
        message: response.output_text,
        toolResults,
      };
    }

    const toolOutputs = [];

    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.arguments);

      const result = await toolExecutor(toolCall.name, args, conversationId);

      if (toolCall.name === "prepareExpense" && result.complete) {
        setAwaitingConfirmation(conversationId, true);
      }

      if (toolCall.name === "addExpense" && result.success) {
        clearPendingExpense(conversationId);

        setAwaitingConfirmation(conversationId, false);
      }

      // Save structured information for the API response
      toolResults.push({
        tool: toolCall.name,
        result,
      });

      toolOutputs.push({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(result),
      });
    }

    response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
        You are SpendAI, an expense management assistant.
        Today's date is ${today}. The user's timezone is Asia/Kolkata.
        Use the results of the tools to answer the user clearly.

        If cancelExpense succeeds, tell the user naturally that you won't add the expense.
        Do not ask for confirmation again.

        CONFIRMATION RULES:

      When an expense has all required details (amount, category, and date):
      - Do NOT save it immediately.
      - The application will put the conversation into confirmation state.
      - Ask the user for confirmation in natural, non-technical language.

      When asking for confirmation:
      - Never say "Please confirm".
      - Never say "record".
      - Never say "database".
      - Never say "entry".
      - Never say "transaction".
      - Never say "dated".
      - Never describe the expense like a system command.
      - Do not expose internal field names such as amount, category, merchant, date, or source.
      - Speak as a friendly personal expense assistant.
      - Briefly acknowledge what the user told you.
      - Restate the important details naturally.
      - Ask whether the user wants you to add it to their expenses.

      Preferred style:
      "I got it — you spent ₹300 on a Zone Burger at Domino’s today. Should I add this to your expenses?"

      Other acceptable styles:
      "Got it — ₹300 for a Zone Burger at Domino’s today. Would you like me to add that to your expenses?"

      "Okay, I have ₹300 for a Zone Burger at Domino’s today. Should I add it to your expenses?"

      Never produce:
      "Please confirm: record ₹300 for a Zone Burger at Domino’s under Food, dated today, September 19, 2026."

        response style: 
        - Use simple, natural, human language.
        - Write responses as if you are speaking directly to the user.
        - Do not use Markdown.
        - Do not use asterisks, bullet points, headings, tables, or special formatting.
        - Keep responses concise.
        - For expense confirmations, state the important details naturally in one or two sentences.
        - Make the response suitable for both displaying on screen and reading aloud by text-to-speech.
      `,

      previous_response_id: response.id,

      input: toolOutputs,
    });
  }
};

export default runSpendAIAgent;
