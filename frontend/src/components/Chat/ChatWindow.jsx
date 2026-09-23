"use client";

import { useState, useRef } from "react";
import Message from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendMessage } from "../../services/chat.service";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm SpendAI. Tell me about an expense or ask me about your spending.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [voiceState, setVoiceState] = useState("idle");
  const conversationIdRef = useRef(
    crypto.randomUUID()
  );

  const speakResponse = (text, onEnd) => {
    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis is not supported.");

      if (onEnd) {
        onEnd();
      }

      return;
    }

    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      if (onEnd) {
        onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (userMessage, isVoice = false) => {
    const userMessageObject = {
      id: Date.now(),
      role: "user",
      content: userMessage,
    };

    setMessages((previousMessages) => [...previousMessages, userMessageObject]);

    setLoading(true);

    if (isVoice) {
      setVoiceState("processing");
    }

    try {
      const data = await sendMessage(userMessage, conversationIdRef.current);

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message,
        toolResults: data.toolResults || [],
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      if (isVoice) {
        setVoiceState("speaking");

        speakResponse(data.message, () => {
          setVoiceState("idle");
        });
      }
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I couldn't process that request. Please try again.",
      };

      setMessages((previousMessages) => [...previousMessages, errorMessage]);

      if (isVoice) {
        setVoiceState("idle");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {messages.length === 1 && !loading && (
        <div className="welcome">
          <div className="welcome-icon">✦</div>

          <h2>What can I help you track?</h2>

          <p>
            Add expenses, check your spending, and understand where your money
            goes.
          </p>

          <div className="suggestions">
            <button onClick={() => handleSendMessage("I spent ₹500 on dinner")}>
              Add ₹500 for dinner
            </button>

            <button
              onClick={() => handleSendMessage("Show me my recent expenses")}
            >
              Show my recent expenses
            </button>

            <button
              onClick={() =>
                handleSendMessage("How much did I spend this month?")
              }
            >
              How much did I spend this month?
            </button>
          </div>
        </div>
      )}

      <div className="messages">
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            toolResults={message.toolResults}
          />
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="message-avatar">S</div>

            <div className="message-bubble">Thinking...</div>
          </div>
        )}
      </div>

      {voiceState !== "idle" && (
        <div className="voice-status">
          {voiceState === "listening" && "🎙️ Listening..."}
          {voiceState === "processing" && "⚙️ SpendAI is thinking..."}
          {voiceState === "speaking" && "🔊 SpendAI is speaking..."}
        </div>
      )}

      <ChatInput
        onSend={handleSendMessage}
        disabled={loading}
        onVoiceStateChange={setVoiceState}
      />
    </div>
  );
}
