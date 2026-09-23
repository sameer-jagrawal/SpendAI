const toolDefinitions = [
  {
    type: "function",
    name: "prepareExpense",
    description:
      "Prepare or update an expense in the current conversation without saving it to the database. Use this when the user is providing expense information or completing a previously started expense.",
    parameters: {
      type: "object",
      properties: {
        amount: {
          type: ["number", "null"],
          description:
            "The expense amount, or null if not known yet."
        },
        currency: {
          type: ["string", "null"],
          description:
            "The expense currency, or null if not known."
        },
        category: {
          type: ["string", "null"],
          description:
            "The expense category, or null if not known."
        },
        merchant: {
          type: ["string", "null"],
          description:
            "The merchant, or null if not known."
        },
        description: {
          type: ["string", "null"],
          description:
            "What was purchased, or null if not known."
        },
        date: {
          type: ["string", "null"],
          description:
            "The actual expense date in YYYY-MM-DD format, or null if not known."
        },
        source: {
          type: "string",
          enum: ["text", "voice", "receipt"],
          description:
            "How the expense was provided by the user."
        }
      },
      required: [
        "amount",
        "currency",
        "category",
        "merchant",
        "description",
        "date",
        "source"
      ],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "confirmExpense",
    description:
      "Confirm and save the expense that is currently waiting for the user's confirmation. Use this only when the user clearly confirms that they want to add the pending expense.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "cancelExpense",
    description:
      "Cancel the expense that is currently waiting for the user's confirmation. Use this only when the user clearly rejects or cancels the pending expense.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "addExpense",
    description: "Add a new expense to the user's expense records.",
    parameters: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "The amount of money spent."
        },

        currency: {
          type: "string",
          description: "The currency of the expense, for example INR."
        },

        category: {
          type: "string",
          description:
            "The expense category, for example Food, Travel, or Shopping."
        },

        merchant: {
          type: "string",
          description: "The merchant or place where the money was spent."
        },

        description: {
          type: "string",
          description: "A short description of the expense."
        },

        date: {
          type: "string",
          description: "The date when the expense occurred."
        },

        source: {
          type: "string",
          enum: ["text", "voice", "receipt"],
          description: "How the expense was provided by the user."
        }
      },

      required: [
        "amount",
        "currency",
        "category",
        "merchant",
        "description",
        "date",
        "source"
      ],

      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "getExpenses",
    description: "Get the user's recent expense records.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description:"Get the user's recent saved expenses. Use this when the user asks to see, show, list, or know about their recent expenses or spending history."
        }
      },
      required: ["limit"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "getLatestExpense",
    description:
      "Get the single most recently created expense. Use this when the user asks for their latest, most recent, last created, or newest expense.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    },
    strict: true
  },  
  {
    type: "function",
    name: "getExpenseSummary",
    description:
      "Calculate a summary of the user's expenses for a specific time period. Use this when the user asks how much they spent, total spending, or spending breakdown.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["today", "week", "month", "all"],
          description:
            "The time period for the expense summary."
        }
      },
      required: ["period"],
      additionalProperties: false
    },
    strict: true
  },
 
];

export default toolDefinitions;