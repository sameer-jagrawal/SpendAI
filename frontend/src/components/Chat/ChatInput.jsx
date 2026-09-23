"use client";

import { useRef, useState } from "react";

export default function ChatInput({ onSend, disabled, onVoiceStateChange }) {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  // -----------------------------
  // Send typed message
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    setMessage("");

    await onSend(trimmedMessage);
  };

  // -----------------------------
  // Start voice recognition
  // -----------------------------
  const startListening = () => {
    if (disabled || listening) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognitionRef.current = recognition;

    // Reset previous transcript
    transcriptRef.current = "";

    // -----------------------------
    // Recognition started
    // -----------------------------
    recognition.onstart = () => {
      setListening(true);

      if (onVoiceStateChange) {
        onVoiceStateChange("listening");
      }
    };

    // -----------------------------
    // Speech result
    // -----------------------------
    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      transcriptRef.current = transcript;

      setMessage(transcript);
    };

    // -----------------------------
    // Recognition error
    // -----------------------------
    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    // -----------------------------
    // Recognition ended
    // -----------------------------
    recognition.onend = async () => {
      setListening(false);
    
      const finalTranscript =
        transcriptRef.current.trim();
    
      if (!finalTranscript || disabled) {
        if (onVoiceStateChange) {
          onVoiceStateChange("idle");
        }
    
        return;
      }
    
      setMessage("");
    
      await onSend(finalTranscript, true);
    
      transcriptRef.current = "";
    };

    recognition.start();
  };

  // -----------------------------
  // Stop voice recognition
  // -----------------------------
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
  };

  // -----------------------------
  // Toggle microphone
  // -----------------------------
  const handleVoiceClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // -----------------------------
  // Enter key
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit(e);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <form
      className="chat-input-wrapper"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          listening
            ? "Listening..."
            : disabled
              ? "SpendAI is thinking..."
              : "Tell SpendAI about an expense..."
        }
        disabled={disabled}
      />

      <button
        type="button"
        className={`voice-button ${
          listening ? "listening" : ""
        }`}
        onClick={handleVoiceClick}
        disabled={disabled}
        aria-label={
          listening
            ? "Stop listening"
            : "Start voice input"
        }
      >
        {listening ? "■" : "🎙"}
      </button>

      <button
        type="submit"
        disabled={
          disabled || !message.trim()
        }
        aria-label="Send message"
      >
        ↑
      </button>
    </form>
  );
}
